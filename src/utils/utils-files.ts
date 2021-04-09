export const fileUtils = {
  selectMultipleFiles: () => {
    return require("electron").remote.dialog.showOpenDialog({
      properties: ["openFile", "multiSelections", "dontAddToRecent"],
      filters: [{ name: "Ảnh ọt", extensions: ["jpg", "png", "gif"] }],
    });
  },
  saveJsonFile: (jsonContent: string) => {
    console.log("fs");
  },
  getWorkingDirectory: () => {
    const remote = require("electron").remote;
    return remote.app.getPath("home");
  }
};
