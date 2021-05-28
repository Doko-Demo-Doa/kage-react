import { ipcRenderer } from "electron";
import { fileUtils } from "~/utils/utils-files";
import { uiUtils } from "~/utils/utils-ui";

export function initializeApp() {
  fileUtils.createCacheDir();

  ipcRenderer.send("app_version");
  ipcRenderer.on("app_version", (event, args) => {
    ipcRenderer.removeAllListeners("app_version");
    uiUtils.openNotification("info", "New version", `There is a new version: ${args.version}`);
  });
}
