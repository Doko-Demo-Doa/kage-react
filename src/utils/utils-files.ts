import fs from "fs-extra";
import { isEmpty, union } from "rambdax";
import dayjs from "dayjs";
import AdmZip from "adm-zip";
import {
  MediaType,
  RESOURCE_PROTOCOL,
  SLIDE_HTML_ENTRY_FILE,
  SLIDE_HTML_HIDDEN_ENTRY_FILE,
} from "~/common/static-data";
import QuizDeckModel from "~/mobx/models/quiz-deck";
import { SlideStockBackgroundMetaType } from "~/typings/types";

function fsNotAvailable() {
  return isEmpty(require("fs"));
}

const CACHE_DIR_NAME = "kage-cache";
const BACKUP_FILE_NAME = "backup.zip";
const SLIDE_MANIFEST_FILE = "manifest.json";
const ALLOWED_IMPORT_EXTENSIONS = ["zip", "dsa", "dst"];

function getStockBackgroundsMeta(): SlideStockBackgroundMetaType {
  const cachePath = getCacheDirectory("vendor");

  const meta: SlideStockBackgroundMetaType = fs.readJsonSync(`${cachePath}/backgrounds/stock.json`);

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
function getCacheDirectory(type?: "assets" | "quiz" | "vendor" | ""): string {
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
  const path = require("path");
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
  const quizDir = getCacheDirectory("quiz");
  if (!fs.existsSync(quizDir)) {
    fs.mkdirSync(quizDir);
    fs.mkdirSync(`${quizDir}/assets`);
  }

  let resourcePath = "";

  // Copy đống file từ extra vào cache
  if (process.env.NODE_ENV !== "production") {
    // Copy từ folder trong project ra. Nằm ở extra/vendor nếu là dev
    resourcePath = path.join(path.resolve("./"), "extra", "vendor");
  } else {
    // Nếu là release thì nó nằm ở dora-extra. Tham khảo file electron-builder.yml
    fs.readdirSync(path.join(process.resourcesPath, "dora-extra", "vendor"));
    resourcePath = path.join(process.resourcesPath, "dora-extra", "vendor");
  }

  const destVendor = path.join(vendorDir);

  fs.copySync(resourcePath, destVendor);
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
  openFolderBrowser: (folderPath: string) => {
    if (fsNotAvailable()) return "";
    const shell = require("electron").shell;
    shell.openPath(folderPath);
  },
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
  // Dùng để chọn folder xuất data ra
  launchFolderOpenDialog: async () => {
    if (fsNotAvailable()) return;

    const remote = require("@electron/remote");
    const data = remote.dialog.showOpenDialog({
      properties: ["dontAddToRecent", "dontAddToRecent"],
      message: "Chọn thư mục xuất",
    });
    const dest = data.filePaths;
    if (!dest) return;
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

    // const data = await require("electron").remote.dialog.showOpenDialog({
    //   properties: ["openDirectory", "dontAddToRecent"],
    // });
    // return data.filePaths[0];
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
        const cachedBackgroundDir = path.join(cacheVendorDir, "backgrounds");
        fs.readdir(cachedBackgroundDir, (err, files) => {
          files.forEach((filename) => {
            if (backgroundFilenames.includes(filename)) {
              console.log("ff", filename);
              fs.copySync(
                path.join(cachedBackgroundDir, filename),
                path.join(destF, "vendor", "backgrounds", filename)
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
    const cachePath = getCacheDirectory("vendor");

    return `${RESOURCE_PROTOCOL}${cachePath}/backgrounds/${assetName}`;
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
  readZipEntries: (inputPath: string) => {
    try {
      const zip = new AdmZip(inputPath);
      const entries = zip.getEntries();
      return entries.map((n) => n.entryName);
    } catch (error) {
      console.log(error);
    }
  },
  // Xả file zip slide và đọc file manifest.
  extractZipToCache: (zipPath: string) => {
    const cacheDir = getCacheDirectory();
    try {
      const zip = new AdmZip(zipPath);
      zip.extractAllTo(cacheDir, true);
      // Copy lại đống vendor vào cache để update:
      fileUtils.createCacheDir();
      return zip.readAsText(SLIDE_MANIFEST_FILE);
    } catch (e) {
      console.log(e);
    }
  },
  zipFilesTo: (dest: string, assets: string[], backgrounds: string[]) => {
    if (fsNotAvailable()) return;
    const remote = require("@electron/remote");
    const path = remote.require("path");

    const cacheDir = getCacheDirectory();

    const newZip = new AdmZip();

    // Add từng file:
    const vendorDir = getCacheDirectory("vendor");
    const manifestPath = path.join(cacheDir, SLIDE_MANIFEST_FILE);
    const htmlEntryPath = path.join(cacheDir, SLIDE_HTML_ENTRY_FILE);
    newZip.addLocalFolder(vendorDir, "vendor");
    // Loại thư mục background không ra tạm:
    newZip.deleteFile("vendor/backgrounds/");

    newZip.addLocalFile(manifestPath);
    newZip.addLocalFile(htmlEntryPath);

    assets.forEach((n) => {
      newZip.addLocalFile(path.join(getCacheDirectory("assets"), n), "assets");
    });

    backgrounds.forEach((n) => {
      newZip.addLocalFile(
        path.join(getCacheDirectory("vendor"), "backgrounds", n),
        "vendor/backgrounds"
      );
    });

    newZip.writeZip(path.join(dest));
  },
};
