import { remote } from "electron";

export const fileUtils = {
  selectMultipleFiles: () => {
    return remote.dialog.showOpenDialog({
      properties: ["openFile", "multiSelections", "dontAddToRecent"],
      filters: [{ name: "Ảnh ọt", extensions: ["jpg", "png", "gif"] }],
    });
  },
  saveJsonFile: (jsonContent: string) => {
    console.log("fs");
  }
};
