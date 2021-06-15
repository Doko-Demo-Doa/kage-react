import { app, protocol, BrowserWindow } from "electron";
import { autoUpdater } from "electron-updater";
import path from "path";
import fs from "fs";
import isDev from "electron-is-dev";
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";

let win: BrowserWindow | null = null;

const preDefinedWidth = 1240;
const predefinedHeight = 730;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function clearCache() {
  const CACHE_DIR_NAME = "kage-cache";
  const cPath = path.join(app.getPath("cache"), CACHE_DIR_NAME);
  fs.unlinkSync(cPath);
}

function createWindow() {
  win = new BrowserWindow({
    width: preDefinedWidth,
    height: predefinedHeight,
    minWidth: preDefinedWidth,
    minHeight: predefinedHeight,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      preload: path.join("preload.js"),
    },
  });

  if (isDev) {
    win.loadURL("http://localhost:3000/");
  } else {
    // 'build/index.html'
    win.loadURL(`file://${__dirname}/../index.html`);
  }

  win.on("closed", () => {
    win = null;
  });

  win.once("ready-to-show", () => {
    // https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/recipes.html#auto-update
    // https://github.com/electron-userland/electron-builder/issues/4599#issuecomment-575885067
    // Override when needed
    // autoUpdater.setFeedURL({
    //   provider: "github",
    //   repo: "repo",
    //   owner: "owner",
    //   private: true,
    //   token: "<personal-access-token>",
    // });
    autoUpdater.checkForUpdatesAndNotify();
    win.show();
  });

  app.whenReady().then(() => {
    // clearCache();

    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log("An error occurred: ", err));

    // Register protocols:
    protocol.registerFileProtocol("local-resource", (request, callback) => {
      const url = request.url.replace(/^local-resource:\/\//, "");
      // Decode URL to prevent errors when loading filenames with UTF-8 chars or chars like "#"
      const decodedUrl = decodeURI(url); // Needed in case URL contains spaces
      try {
        console.log("Protocol registered");
        return callback(decodedUrl);
      } catch (error) {
        console.error("ERROR: registerLocalResourceProtocol: Could not get file path:", error);
      }
    });
  });

  win.webContents.on("did-frame-finish-load", () => {
    win.webContents.openDevTools({ mode: "detach" });
    // if (isDev) {
    //   win.webContents.openDevTools({ mode: "detach" });
    // }
  });
}

if (process.env.NODE_ENV === "production") {
  require("./menu.ts");
}
app.on("ready", createWindow);

app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDev) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

autoUpdater.on("update-available", () => {
  win.webContents.send("update_available");
});
autoUpdater.on("update-downloaded", () => {
  win.webContents.send("update_downloaded");
});
