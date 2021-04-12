import { isEmpty } from "rambdax";
import { MediaType } from "~/common/static-data";

function fsNotAvailable() {
  return isEmpty(require("fs"));
}

const CACHE_DIR_NAME = "kage-cache";

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
    if ((/\.(mkv|mp4|wmv|avi|webp)$/i).test(filePath)) {
      return MediaType.VIDEO;
    }
    if ((/\.(jpe?g|jpg|png|gif|heif)$/i).test(filePath)) {
      return MediaType.IMAGE;
    }
    if ((/\.(mp3|ogg|aac|flac)$/i).test(filePath)) {
      return MediaType.AUDIO;
    }
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
    return require("electron").remote.dialog.showOpenDialog({
      properties: ["openFile", "dontAddToRecent"],
      filters: [
        { name: "Images", extensions: ["jpg", "png", "gif"] },
        { name: "Movies", extensions: ["webm", "avi", "mp4"] },
      ],
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
  getCacheDirectory: () => {
    if (fsNotAvailable()) return;
    const remote = require("electron").remote;
    const path = remote.require("path");
    return path.join(remote.app.getPath("cache"), CACHE_DIR_NAME);
  },
  createFilePathAtCacheDir: (filename: string) => {
    if (fsNotAvailable()) return;
    const remote = require("electron").remote;
    const path = remote.require("path");
    const cacheDir = remote.app.getPath("cache");
    const cachePath = path.join(cacheDir, CACHE_DIR_NAME);
    return path.join(cachePath, filename);
  },
};
