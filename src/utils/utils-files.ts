import { isEmpty } from "rambdax";
import { MediaType } from "~/common/static-data";

function fsNotAvailable() {
  return isEmpty(require("fs"));
}

export const fileUtils = {
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
      filters: [{ name: "Ảnh ọt", extensions: ["jpg", "png", "gif"] }],
    });
  },
  selectSingleFile: () => {
    if (fsNotAvailable()) return;
    return require("electron").remote.dialog.showOpenDialog({
      properties: ["openFile", "dontAddToRecent"],
      filters: [
        { name: "Movies", extensions: ["webm", "avi", "mp4"] },
        { name: "Images", extensions: ["jpg", "png", "gif"] },
      ],
    });
  },
  saveJsonFile: (jsonContent: string) => {
    console.log("fs");
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

    const cacheDir = path.join(remote.app.getPath("cache"), "kage-cache");
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir);
    }
    return remote.app.getPath("cache");
  },
  getCacheDirectory: () => {
    if (fsNotAvailable()) return;
    const remote = require("electron").remote;
    return remote.app.getPath("cache");
  }
};
