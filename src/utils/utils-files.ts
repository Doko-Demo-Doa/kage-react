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
  saveJsonFile: (jsonContent: string) => {
    console.log("fs");
  },
  getWorkingDirectory: () => {
    if (fsNotAvailable()) return;
    const remote = require("electron").remote;
    return remote.app.getPath("cache");
  },
  getCacheDirectory: () => {
    if (fsNotAvailable()) return;
    const remote = require("electron").remote;
    return remote.app.getPath("cache");
  }
};
