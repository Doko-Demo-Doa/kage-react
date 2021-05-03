import { isEmpty } from "rambdax";
import { MediaType, RESOURCE_PROTOCOL } from "~/common/static-data";

function fsNotAvailable() {
  return isEmpty(require("fs"));
}

const CACHE_DIR_NAME = "kage-cache";

/**
 * assets: Chứa các file ảnh, audio, video đã qua xử lý.
 * quiz: Chứa các file quiz json tạo ra từ quiz builder.
 * @param type Tên loại thư mục cần lấy ra từ cache:
 * @returns
 */
function getCacheDirectory(type?: "assets" | "quiz" | "vendor" | "") {
  if (fsNotAvailable()) return;

  const subdir = type !== undefined ? type : "";

  const remote = require("electron").remote;
  const path = remote.require("path");
  const cPath = path.join(remote.app.getPath("cache"), subdir, CACHE_DIR_NAME);
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

    const cacheDir: string = path.join(remote.app.getPath("cache"), CACHE_DIR_NAME);
    const destF = path.join(dest, "slide_export");
    fs.copySync(cacheDir, destF);
  },
  selectMultipleFiles: () => {
    if (fsNotAvailable()) return;
    return require("electron").remote.dialog.showOpenDialog({
      properties: ["openFile", "multiSelections", "dontAddToRecent"],
      filters: [{ name: "Ảnh", extensions: ["jpg", "png", "gif"] }],
    });
  },
  selectSingleFile: () => {
    if (fsNotAvailable()) return;
    const imageTypes = ["jpg", "png", "gif"];
    const videoTypes = ["webm", "avi", "mp4", "mkv"];
    const audioTypes = ["mp3", "aac", "ogg", "ts", "flac"];
    return require("electron").remote.dialog.showOpenDialog({
      properties: ["openFile", "dontAddToRecent"],
      filters: [{ name: "Media", extensions: [...imageTypes, ...videoTypes, ...audioTypes] }],
    });
  },
  getWorkingDirectory: () => {
    if (fsNotAvailable()) return;
    const remote = require("electron").remote;
    return remote.app.getPath("cache");
  },
  createCacheDir: () => {
    if (fsNotAvailable()) return;
    const remote = require("electron").remote;
    const fs = remote.require("fs");
    const path = remote.require("path");

    const cacheDir = path.join(remote.app.getPath("cache"), CACHE_DIR_NAME);
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir);
    }
    return remote.app.getPath("cache");
  },
  getCacheDirectory,
  createFilePathAtCacheDir: (filename: string) => {
    if (fsNotAvailable()) return;
    const remote = require("electron").remote;
    const path = remote.require("path");
    const cacheDir = remote.app.getPath("cache");
    const cachePath = path.join(cacheDir, CACHE_DIR_NAME);
    return path.join(cachePath, filename);
  },
  getUsableAssetUrl: (assetName: string) => {
    return `${RESOURCE_PROTOCOL}${getCacheDirectory("assets")}/${assetName}`;
  },
};
