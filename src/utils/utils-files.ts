import fs from "fs-extra";
import { isEmpty, union } from "rambdax";
import dayjs from "dayjs";
// adm-zip for reading, zip-lib for creating
import AdmZip from "adm-zip";
import path from "path";
import {
  MediaType,
  RESOURCE_PROTOCOL,
  SLIDE_HTML_ENTRY_FILE,
  SLIDE_HTML_HIDDEN_ENTRY_FILE,
  ALLOWED_IMPORT_EXTENSIONS,
  SLIDE_MANIFEST_FILE,
} from "~/common/static-data";
import QuizDeckModel from "~/mobx/models/quiz-deck";
import {
  FileNameWithPathType,
  SlideStockBackgroundMetaType,
  ZipConstructType,
} from "~/typings/types";

function fsNotAvailable() {
  return isEmpty(require("fs"));
}

const CACHE_DIR_NAME = "kage-cache";
const BACKUP_FILE_NAME = "backup.zip";

function getStockBackgroundsMeta(): SlideStockBackgroundMetaType {
  const cachePath = getCacheDirectory("backgrounds");

  const meta: SlideStockBackgroundMetaType = fs.readJsonSync(`${cachePath}/stock.json`);

  return meta;
}

/**
 * - assets: Chứa các file ảnh, audio, video đã qua xử lý.
 * - quiz: Chứa các file quiz json tạo ra từ quiz builder.
 * - vendor: Chứa các file code từ bên thứ 3.
 *
 * @param type Tên loại thư mục cần lấy ra từ cache:
 * @returns String path đã chuẩn hoá trên các hệ điều hành
 */
function getCacheDirectory(type?: "assets" | "quiz" | "vendor" | "backgrounds" | ""): string {
  if (fsNotAvailable()) return "";

  const subdir = type !== undefined ? type : "";

  const remote = require("@electron/remote");
  const path = remote.require("path");
  const cPath = path.join(remote.app.getPath("cache"), CACHE_DIR_NAME, subdir);
  return cPath.replace(/\\/g, "/");
}

/**
 * Tạo đầy đủ thư mục cache và update các file css custom, vendor mới đè lên vendor của slide cũ.
 */
function createCacheDir() {
  if (fsNotAvailable()) return;
  const remote = require("@electron/remote");
  const fs = remote.require("fs-extra");

  // Tạo cache dir
  const cacheDir = getCacheDirectory();
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir);
  }
  const assetsDir = getCacheDirectory("assets");
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir);
  }
  const vendorDir = getCacheDirectory("vendor");
  if (!fs.existsSync(vendorDir)) {
    fs.mkdirSync(vendorDir);
  }
  const backgroundsDir = getCacheDirectory("backgrounds");
  if (!fs.existsSync(backgroundsDir)) {
    fs.mkdirSync(backgroundsDir);
  }
  const quizDir = getCacheDirectory("quiz");
  if (!fs.existsSync(quizDir)) {
    fs.mkdirSync(quizDir);
    fs.mkdirSync(`${quizDir}/assets`);
  }
}

function prepareCacheContent() {
  const remote = require("@electron/remote");
  const vendorDir = getCacheDirectory("vendor");
  const backgroundsDir = getCacheDirectory("backgrounds");
  let vendorResourcePath = "";
  let backgroundsResourcePath = "";

  console.log("aaaa", process.env.NODE_ENV);

  // Copy đống file từ extra vào cache
  if (process.env.NODE_ENV !== "production") {
    // Copy từ folder trong project ra. Nằm ở extra/vendor nếu là dev
    vendorResourcePath = path.join(path.resolve("./"), "extra", "vendor");
    backgroundsResourcePath = path.join(path.resolve("./"), "extra", "backgrounds");
  } else {
    // Nếu là release thì nó nằm ở dora-extra. Tham khảo file electron-builder.yml
    vendorResourcePath = path.join(process.resourcesPath, "dora-extra", "vendor");
    backgroundsResourcePath = path.join(process.resourcesPath, "dora-extra", "backgrounds");
  }

  const destVendor = path.join(vendorDir);
  const destBackgrounds = path.join(backgroundsDir);

  fs.copySync(vendorResourcePath, destVendor);
  fs.copySync(backgroundsResourcePath, destBackgrounds);
  return remote.app.getPath("cache");
}

/**
 * Lấy path của folder quiz cache. Nằm ở kage-cache/quiz
 * Nếu có type thì lấy path thư mục con là tên của type.
 * VD: kage-cache/quiz/assets hay kage-cache/quiz/vendor
 */
function getQuizCacheDirectory(type?: "assets" | "vendor") {
  if (fsNotAvailable()) return "";

  const subdir = type !== undefined ? type : "";

  const remote = require("@electron/remote");
  const path = remote.require("path");
  const cPath = path.join(getCacheDirectory("quiz"), subdir);

  return cPath.replace(/\\/g, "/");
}

function checkFileExists(path: string): boolean {
  if (fsNotAvailable()) return false;
  const remote = require("@electron/remote");
  const fs = remote.require("fs-extra");
  return fs.existsSync(path);
}

function readZipEntries(inputPath: string) {
  try {
    const zip = new AdmZip(inputPath);
    const entries = zip.getEntries();
    return entries.map((n) => n.entryName);
  } catch (error) {
    console.log(error);
  }
}

function readZipEntryManifest(zipPath: string) {
  if (fsNotAvailable()) return;

  try {
    const zip = new AdmZip(zipPath);
    const data = JSON.parse(zip.readAsText(SLIDE_MANIFEST_FILE));
    return data;
  } catch (error) {
    console.log(error);
  }
}

function writeEntryIntoZip(zipPath: string, entryName: string, data: Buffer) {
  if (fsNotAvailable()) return;
  try {
    const zip = new AdmZip(zipPath);
    zip.updateFile(entryName, data);
    zip.writeZip();
  } catch (error) {
    console.log(error);
  }
}

export const fileUtils = {
  getCRC32: (filePath: string): string => {
    if (fsNotAvailable()) return "";
    const remote = require("@electron/remote");
    const crc32 = remote.require("crc").crc32;
    const fs = remote.require("fs");

    const result = crc32(fs.readFileSync(filePath)).toString(16);
    return result;
  },
  detectMediaType: (filePath: string) => {
    if (/\.(mkv|mp4|wmv|avi|webp|ogv)$/i.test(filePath)) {
      return MediaType.VIDEO;
    }
    if (/\.(jpe?g|jpg|png|gif|heif)$/i.test(filePath)) {
      return MediaType.IMAGE;
    }
    if (/\.(mp3|ogg|aac|flac|m4a)$/i.test(filePath)) {
      return MediaType.AUDIO;
    }
  },
  // Mở folder chỉ định bằng Explorer hoặc Finder
  openFolderBrowser: (folderPath: string) => {
    if (fsNotAvailable()) return "";
    const shell = require("electron").shell;
    shell.openPath(folderPath);
  },
  // Mở hộp thoại chọn file, các file đuôi .zip, .dsa và .dst
  openFileDialog: async () => {
    if (fsNotAvailable()) return;
    const remote = require("@electron/remote");
    const data = await remote.dialog.showOpenDialog({
      properties: ["openFile", "dontAddToRecent"],
      filters: [
        {
          name: "Dora Slide Archive",
          extensions: ALLOWED_IMPORT_EXTENSIONS,
        },
      ],
    });
    return data.filePaths[0];
  },
  // Dùng để chọn folder
  launchFolderOpenDialog: async (): Promise<string> => {
    if (fsNotAvailable()) return Promise.resolve("");

    const remote = require("@electron/remote");
    const data = await remote.dialog.showOpenDialog({
      properties: ["dontAddToRecent", "openDirectory"],
      message: "Chọn thư mục",
    });
    const dest = data.filePaths;
    if (!dest) return Promise.resolve("");
    return dest[0];
  },
  launchFileSaveDialog: async () => {
    if (fsNotAvailable()) return;
    const remote = require("@electron/remote");
    const data = await remote.dialog.showSaveDialog({
      defaultPath: `slide-${dayjs().format("YYYYMMDD.HHmmss")}.zip`,
      properties: ["dontAddToRecent", "createDirectory"],
      message: "Chọn thư mục xuất file",
    });
    const dest = data.filePath;
    if (!dest) return;
    return dest;
  },
  launchFolderSaveDialog: async () => {
    if (fsNotAvailable()) return;
    const remote = require("@electron/remote");
    const data = await remote.dialog.showSaveDialog({
      defaultPath: `slide-${dayjs().format("YYYYMMDD.HHmmss")}`,
      properties: ["dontAddToRecent", "createDirectory"],
      message: "Chọn thư mục xuất file",
    });
    const dest = data.filePath;
    if (!dest) return;
    return dest;
  },
  // Chuyển file từ vendor + cache vào thư mục đích
  copyFromCacheToDest: async (
    dest: string,
    onlyAssets?: string[],
    backgroundFilenames?: string[]
  ) => {
    if (fsNotAvailable()) return;
    const remote = require("@electron/remote");
    // const fs = remote.require("fs-extra");
    const path = remote.require("path");

    const cacheDir: string = getCacheDirectory();
    const destF = path.join(dest);

    // Nếu có onlyAssets thì chỉ copy các file asset này.
    if (onlyAssets) {
      // Copy từng thằng vào một:
      const cacheVendorDir = getCacheDirectory("vendor");
      const cacheBackgroundDir = getCacheDirectory("backgrounds");

      fs.copySync(cacheVendorDir, path.join(destF, "vendor"), {
        filter: function (name: string) {
          if (name.includes(".DS_Store") || name.includes("thumb.db")) return false;
          if (name.includes("themes")) return false;
          if (name.includes("backgrounds")) return false;
          return true;
        },
      });

      // Chỉ copy background đang dùng:
      if (backgroundFilenames) {
        fs.readdir(cacheBackgroundDir, (err, files) => {
          files.forEach((filename) => {
            if (backgroundFilenames.includes(filename)) {
              fs.copySync(
                path.join(cacheBackgroundDir, filename),
                path.join(destF, "backgrounds", filename)
              );
            }
          });
        });
      }

      const manifestPath = path.join(cacheDir, SLIDE_MANIFEST_FILE);
      fs.copySync(manifestPath, path.join(destF, SLIDE_MANIFEST_FILE));
      const htmlEntryPath = path.join(cacheDir, SLIDE_HTML_ENTRY_FILE);
      fs.copySync(htmlEntryPath, path.join(destF, SLIDE_HTML_ENTRY_FILE));

      // Chỉ copy các file cần thiết:
      onlyAssets.forEach((n) => {
        fs.copySync(path.join(getCacheDirectory("assets"), n), path.join(destF, "assets", n));
      });

      return;
    }
    fs.copySync(cacheDir, destF);
  },
  selectMultipleFiles: () => {
    if (fsNotAvailable()) return;
    const remote = require("@electron/remote");
    return remote.dialog.showOpenDialog({
      properties: ["openFile", "multiSelections", "dontAddToRecent"],
      filters: [{ name: "Ảnh", extensions: ["jpg", "png", "gif"] }],
    });
  },
  selectSingleFile: async (specificType?: MediaType) => {
    if (fsNotAvailable()) return;
    const imageTypes = ["jpg", "png", "gif", "webp"];
    const videoTypes = ["webm", "avi", "mp4", "mkv", "wmv"];
    const audioTypes = ["mp3", "aac", "ogg", "ts", "flac"];
    let filterz: string[] = [];
    if (specificType === MediaType.IMAGE) {
      filterz = union(filterz, imageTypes).slice();
    }
    if (specificType === MediaType.VIDEO) {
      filterz = union(filterz, videoTypes).slice();
    }
    if (specificType === MediaType.AUDIO) {
      filterz = union(filterz, audioTypes).slice();
    }

    const remote = require("@electron/remote");
    const resp = await remote.dialog.showOpenDialog({
      properties: ["openFile", "dontAddToRecent"],
      filters: [{ name: "Media", extensions: filterz }],
    });
    return resp?.filePaths[0];
  },
  /**
   * Quét thư mục chỉ định, nếu đọc được và có file slide thì trả về trong mảng, không thì trả về mảng rỗng.
   * @param folderPath Đường dẫn folder chỉ định.
   * @returns Mảng string chứa dường dẫn đến các file slide hợp lệ.
   */
  scanForSlideArchivesIn: (folderPath: string): FileNameWithPathType[] => {
    function endsWithAny(suffixes: string[], str: string) {
      for (const suffix of suffixes) {
        if (str.endsWith(suffix)) return true;
      }
      return false;
    }

    if (fsNotAvailable()) return [];
    const remote = require("@electron/remote");
    const fs = remote.require("fs-extra");
    const path = remote.require("path");
    const files: string[] = fs.readdirSync(folderPath);

    const allowedFiles: FileNameWithPathType[] = files
      .filter((n) => endsWithAny(ALLOWED_IMPORT_EXTENSIONS, n))
      .filter((n) => {
        const entries = new AdmZip(path.join(folderPath, n)).getEntries().map((n) => n.entryName);
        if (entries.includes(SLIDE_MANIFEST_FILE) && entries.includes(SLIDE_HTML_ENTRY_FILE)) {
          return true;
        }
        return false;
      })
      .map((n) => ({
        filename: n,
        path: path.join(folderPath, n),
        exportedFrom: JSON.parse(new AdmZip(path.join(folderPath, n)).readAsText("manifest.json"))
          .exportedFrom,
      }));

    return allowedFiles;
  },
  deleteFileAt: (path: string) => {
    if (fsNotAvailable()) return;
    const remote = require("@electron/remote");
    const fs = remote.require("fs-extra");
    fs.unlink(path);
  },
  clearCacheDir: () => {
    if (fsNotAvailable()) return;
    const remote = require("@electron/remote");
    const fs = remote.require("fs-extra");
    const cPath = getCacheDirectory();

    if (fs.existsSync(cPath)) {
      fs.rmdirSync(cPath, { recursive: true });
    }
  },
  createCacheDir,
  prepareCacheContent,
  checkFileExists,
  getCacheDirectory,
  /**
   * Lấy đường dẫn file slide backup khi người dùng soạn slide nhưng chưa lưu vào file nào.
   * @returns Đường dẫn đến file backup zip chứa file slide được backup 1 phút / lần.
   */
  getBackupFilePath: () => {
    if (fsNotAvailable()) return;
    const remote = require("@electron/remote");
    const path = remote.require("path");
    const cachePath = getCacheDirectory();
    return path.join(cachePath, BACKUP_FILE_NAME);
  },
  getQuizCacheDirectory,
  createFilePathAtCacheDir: (filename: string) => {
    if (fsNotAvailable()) return;
    const remote = require("@electron/remote");
    const path = remote.require("path");
    const cachePath = getCacheDirectory();
    return path.join(cachePath, filename);
  },
  getRawCacheUrl: () => {
    return `file://${getCacheDirectory()}`;
  },
  getRootResourceUrl: () => {
    return `${RESOURCE_PROTOCOL}${getCacheDirectory("")}`;
  },
  getStockBackgroundsMeta,
  /**
   * @param assetName Tên file background, có liệt kê trong file stock.json
   * @returns URL đến file background, kích thước khoảng 2000x1500, JPG
   */
  getSlideBackgroundUrl: (assetName: string) => {
    if (fsNotAvailable()) return;
    const cachePath = getCacheDirectory("backgrounds");

    return `${RESOURCE_PROTOCOL}${cachePath}/${assetName}`;
  },
  getUsableAssetUrl: (assetName: string | undefined) => {
    return `${RESOURCE_PROTOCOL}${getCacheDirectory("assets")}/${assetName}`;
  },

  // Quiz related
  getUsableQuizAssetUrl: (assetName: string) => {
    return `${RESOURCE_PROTOCOL}${getQuizCacheDirectory("assets")}/${assetName}`;
  },
  /**
   * Export quiz into file. Should be named *.drq, which is actually a zip file.
   * @param quizMeta Meta data
   * @param quizArray The quiz array
   * @returns void
   */
  exportQuizToFile: async (quizMeta: QuizDeckModel, quizArray: any[]) => {
    if (fsNotAvailable()) return;
    const remote = require("@electron/remote");
    const data = await remote.dialog.showSaveDialog({
      defaultPath: `quiz-${dayjs().format("YYYYMMDD.HHmmss")}.json`,
      properties: ["dontAddToRecent", "createDirectory"],
      message: "Chọn thư mục xuất file quiz",
    });
    const dest = data.filePath;
    if (!dest) return;

    // Consult quiz-template.json:
    const exportData = {
      id: quizMeta.id,
      name: quizMeta.name,
      creationTime: dayjs().unix(),
      instruction: quizMeta.instruction,
      passingScore: quizMeta.passingScore,
      quizzes: quizArray,
    };
    const result = await fs.writeJSON(dest, exportData, {
      spaces: 2,
    });
    return result;
  },
  saveSlideJsonToCache: (jsonData: string) => {
    const p = fileUtils.createFilePathAtCacheDir(SLIDE_MANIFEST_FILE);
    const remote = require("@electron/remote");
    const fs = remote.require("fs");
    fs.writeFileSync(p, jsonData);
  },
  writeToHtml: (content: string, isSecondary?: boolean) => {
    const path = fileUtils.createFilePathAtCacheDir(SLIDE_HTML_ENTRY_FILE);
    const remote = require("@electron/remote");
    const fs = remote.require("fs");
    if (isSecondary) {
      const path2 = fileUtils.createFilePathAtCacheDir(SLIDE_HTML_HIDDEN_ENTRY_FILE);
      fs.writeFileSync(path2, content);
      return;
    }
    fs.writeFileSync(path, content);
  },
  readZipEntries,
  // Đọc file manifest.json trong file zip.
  readZipEntryManifest,
  // Ghi đè dữ liệu từ buffer vào entry trong file zip.
  writeEntryIntoZip,
  // Xả file zip slide và đọc file manifest.
  extractZipToCache: (zipPath: string) => {
    const cacheDir = getCacheDirectory();
    try {
      const zip = new AdmZip(zipPath);
      zip.extractAllTo(cacheDir, true);
      // Copy lại đống vendor vào cache để update:
      createCacheDir();
      return zip.readAsText(SLIDE_MANIFEST_FILE);
    } catch (e) {
      console.log(e);
    }
  },
  zipFilesTo: (dest: string, assets: string[], backgrounds: string[]) => {
    if (fsNotAvailable()) return;
    const remote = require("@electron/remote");
    const ZipLib = remote.require("zip-lib");
    const cacheDir = getCacheDirectory();

    // Add từng file:
    const vendorDir = getCacheDirectory("vendor");
    const manifestPath = path.join(cacheDir, SLIDE_MANIFEST_FILE);
    const htmlEntryPath = path.join(cacheDir, SLIDE_HTML_ENTRY_FILE);

    const zl = new ZipLib.Zip();
    zl.addFile(manifestPath);
    zl.addFile(htmlEntryPath);
    zl.addFolder(vendorDir, "vendor");
    assets.forEach((n) => {
      zl.addFile(path.join(getCacheDirectory("assets"), n), "assets/" + n);
    });
    backgrounds.forEach((n) => {
      // https://github.com/fpsqdb/zip-lib#zip-with-metadata
      zl.addFile(path.join(getCacheDirectory("backgrounds"), n), "backgrounds/" + n);
    });

    zl.archive(dest);
  },
  // Dùng để làm mới lại file zip theo cấu trúc mới, bao gồm cả folder backgrounđ, file html, manifest.
  reconstructZipTo: (dest: string, { assets, backgrounds }: ZipConstructType) => {
    if (fsNotAvailable()) return;
    const remote = require("@electron/remote");
    const ZipLib = remote.require("zip-lib");
    const cacheDir = getCacheDirectory();

    // Add từng file:
    const vendorDir = getCacheDirectory("vendor");
    const manifestPath = path.join(cacheDir, SLIDE_MANIFEST_FILE);
    const htmlEntryPath = path.join(cacheDir, SLIDE_HTML_ENTRY_FILE);

    const zl = new ZipLib.Zip();
    zl.addFile(manifestPath);
    zl.addFile(htmlEntryPath);
    zl.addFolder(vendorDir, "vendor");
    assets.forEach((n) => {
      zl.addFile(path.join(getCacheDirectory("assets"), n), "assets/" + n);
    });
    backgrounds.forEach((n) => {
      // https://github.com/fpsqdb/zip-lib#zip-with-metadata
      zl.addFile(path.join(getCacheDirectory("backgrounds"), n), "backgrounds/" + n);
    });

    zl.archive(dest);
  },
};
