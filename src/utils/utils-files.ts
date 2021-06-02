import fs from "fs-extra";
import { isEmpty, union } from "rambdax";
import dayjs from "dayjs";
import { MediaType, RESOURCE_PROTOCOL } from "~/common/static-data";
import QuizDeckModel from "~/mobx/models/quiz-deck";

function fsNotAvailable() {
  return isEmpty(require("fs"));
}

const CACHE_DIR_NAME = "kage-cache";
const EXPORT_DIR_NAME = "slide_export";

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

  const remote = require("electron").remote;
  const path = remote.require("path");
  const cPath = path.join(remote.app.getPath("cache"), CACHE_DIR_NAME, subdir);
  return cPath.replace(/\\/g, "/");
}

/**
 * Lấy path của folder quiz cache. Nằm ở kage-cache/quiz
 * Nếu có type thì lấy path thư mục con là tên của type.
 * VD: kage-cache/quiz/assets hay kage-cache/quiz/vendor
 */
function getQuizCacheDirectory(type?: "assets" | "vendor") {
  if (fsNotAvailable()) return "";

  const subdir = type !== undefined ? type : "";

  const remote = require("electron").remote;
  const path = remote.require("path");
  const cPath = path.join(getCacheDirectory("quiz"), subdir);

  return cPath.replace(/\\/g, "/");
}

export const fileUtils = {
  getCRC32: (filePath: string): string => {
    if (fsNotAvailable()) return "";
    const remote = require("electron").remote;
    const crc32 = remote.require("crc").crc32;
    const fs = remote.require("fs");

    const result = crc32(fs.readFileSync(filePath)).toString(16);
    return result;
  },
  detectMediaType: (filePath: string) => {
    if (/\.(mkv|mp4|wmv|avi|webp)$/i.test(filePath)) {
      return MediaType.VIDEO;
    }
    if (/\.(jpe?g|jpg|png|gif|heif)$/i.test(filePath)) {
      return MediaType.IMAGE;
    }
    if (/\.(mp3|ogg|aac|flac)$/i.test(filePath)) {
      return MediaType.AUDIO;
    }
  },
  openFolderBrowser: (folderPath: string) => {
    if (fsNotAvailable()) return "";
    const shell = require("electron").shell;
    shell.openPath(folderPath);
  },
  // Dùng để chọn folder xuất data ra
  openFolderSaveDialog: async () => {
    if (fsNotAvailable()) return;
    const data = await require("electron").remote.dialog.showOpenDialog({
      properties: ["openDirectory", "dontAddToRecent"],
    });
    return data.filePaths[0];
  },
  // Chuyển file từ vendor + cache vào thư mục đích
  copyFromCacheToDest: async (dest: string) => {
    if (fsNotAvailable()) return;
    const remote = require("electron").remote;
    const fs = remote.require("fs-extra");
    const path = remote.require("path");

    const cacheDir: string = getCacheDirectory();
    const destF = path.join(dest, EXPORT_DIR_NAME);
    fs.copySync(cacheDir, destF);
  },
  // Copy các file vendor vào thư mục chỉ định.
  copyVendorFilesToDest: async (dest: string) => {
    if (fsNotAvailable()) return;
    const remote = require("electron").remote;
    const fs = remote.require("fs-extra");
    const path = remote.require("path");

    let vendorPath = "";

    if (process.env.NODE_ENV !== "production") {
      // Copy từ folder trong project ra. Nằm ở extra/vendor nếu là dev
      vendorPath = path.join(path.resolve("./"), "extra", "vendor");
    } else {
      // Nếu là release thì nó nằm ở dora-extra. Tham khảo file electron-builder.yml
      vendorPath = path.dirname(__dirname, "dora-extra");
    }

    const destVendor = path.join(dest, EXPORT_DIR_NAME, "vendor");
    fs.copySync(vendorPath, destVendor);
  },
  selectMultipleFiles: () => {
    if (fsNotAvailable()) return;
    return require("electron").remote.dialog.showOpenDialog({
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

    const resp = await require("electron").remote.dialog.showOpenDialog({
      properties: ["openFile", "dontAddToRecent"],
      filters: [{ name: "Media", extensions: filterz }],
    });
    return resp?.filePaths[0];
  },
  getWorkingDirectory: () => {
    if (fsNotAvailable()) return;
    const remote = require("electron").remote;
    return remote.app.getPath("cache");
  },
  createCacheDir: () => {
    if (fsNotAvailable()) return;
    const remote = require("electron").remote;
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
    }

    let resourcePath = "";

    // Copy đống file từ extra vào cache
    if (process.env.NODE_ENV !== "production") {
      // Copy từ folder trong project ra. Nằm ở extra/vendor nếu là dev
      resourcePath = path.join(path.resolve("./"), "extra", "vendor");
    } else {
      // Nếu là release thì nó nằm ở dora-extra. Tham khảo file electron-builder.yml
      resourcePath = path.dirname(__dirname, "dora-extra");
    }

    const destVendor = path.join(vendorDir);

    fs.copySync(resourcePath, destVendor);
    return remote.app.getPath("cache");
  },
  getCacheDirectory,
  getQuizCacheDirectory,
  createFilePathAtCacheDir: (filename: string) => {
    if (fsNotAvailable()) return;
    const remote = require("electron").remote;
    const path = remote.require("path");
    const cachePath = getCacheDirectory();
    return path.join(cachePath, filename);
  },
  getUsableAssetUrl: (assetName: string) => {
    return `${RESOURCE_PROTOCOL}${getCacheDirectory("assets")}/${assetName}`;
  },
  // Quiz related
  /**
   * Export quiz into file. Should be named *.drq, which is actually a zip file.
   * @param quizMeta Meta data
   * @param quizArray The quiz array
   * @returns void
   */
  exportQuizToFile: async (quizMeta: QuizDeckModel, quizArray: any[]) => {
    if (fsNotAvailable()) return;
    const data = await require("electron").remote.dialog.showSaveDialog({
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
    const p = fileUtils.createFilePathAtCacheDir("manifest.json");
    const remote = require("electron").remote;
    const fs = remote.require("fs");
    fs.writeFileSync(p, jsonData);
  },
  writeToHtml: (content: string) => {
    const path = fileUtils.createFilePathAtCacheDir("slide.html");
    const remote = require("electron").remote;
    const fs = remote.require("fs");
    fs.writeFileSync(path, content);
  },
};
