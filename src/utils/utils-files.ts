import { isEmpty } from "rambdax";
import { isElectron } from "~/utils/utils-platform";

function fsNotAvailable() {
  return isEmpty(require("fs"));
}

export const fileUtils = {
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
