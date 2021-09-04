import { app, protocol, ipcMain, BrowserWindow } from "electron";
import { autoUpdater } from "electron-updater";
import path from "path";
import isDev from "electron-is-dev";
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";

require("@electron/remote/main").initialize();

import * as StaticData from "../src/common/static-data";
import * as Typings from "../src/typings/types";

let win: BrowserWindow | null = null;
let previewWin: BrowserWindow | null = null;

// Alternative: https://www.electronjs.org/docs/tutorial/updates
autoUpdater.autoInstallOnAppQuit = true;

const preDefinedWidth = 1240;
const predefinedHeight = 730;

const singleInstanceLock = app.requestSingleInstanceLock();

let isPrompting = false;

// Only run single instance
if (!singleInstanceLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (win) {
      if (win.isMinimized()) {
        win.restore();
      } else {
        win.focus();
      }
    }
  });
}

function createWindow() {
  win = new BrowserWindow({
    width: preDefinedWidth,
    height: predefinedHeight,
    minWidth: preDefinedWidth,
    minHeight: predefinedHeight,
    webPreferences: {
      webviewTag: true,
      nativeWindowOpen: true,
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

  win.once("show", () => {
    isPrompting = false;
    win.show();
  });

  win.on("close", function (e) {
    if (!isPrompting) {
      e.preventDefault();
      win.webContents.send(StaticData.ElectronEventType.OPEN_APP_CLOSE_PROMPT);
      isPrompting = true;
    }
  });

  win.on("closed", () => {
    win = null;
    previewWin?.close();
    previewWin = null;
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
        return callback(decodedUrl);
      } catch (error) {
        console.error("ERROR: registerLocalResourceProtocol: Could not get file path:", error);
      }
    });

    // Event listeners from renderer
    ipcMain.on(StaticData.ElectronEventType.UPDATE_CHECK, (event, args) => {
      checkUpdate(args);
    });

    ipcMain.on(StaticData.ElectronEventType.QUIT_TO_INSTALL, () => {
      autoUpdater.quitAndInstall();
    });

    ipcMain.on(StaticData.ElectronEventType.OPEN_PREVIEW, () => {
      showPreviewWindow();
    });

    ipcMain.on(StaticData.ElectronEventType.CLOSE_APP, () => {
      win.close();
      app.quit();
    });

    ipcMain.on(StaticData.ElectronEventType.ON_CANCEL_CLOSE_PROMPT, () => {
      isPrompting = false;
    });
  });

  win.webContents.on("did-frame-finish-load", () => {
    if (isDev) {
      win.webContents.openDevTools({ mode: "detach" });
    }
  });

  process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
}

function showPreviewWindow() {
  if (previewWin) return;
  previewWin = new BrowserWindow({
    width: 740,
    height: 580,
    resizable: false,
    focusable: true,
    minimizable: false,
    acceptFirstMouse: true,
    kiosk: true,
    webPreferences: {
      webSecurity: false,
      webviewTag: true,
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  if (app.isPackaged) {
    previewWin.removeMenu();
  }

  if (isDev) {
    previewWin.loadURL("http://localhost:3000/#/preview");
  } else {
    // 'build/index.html'
    previewWin.loadURL(`file://${__dirname}/../index.html#/preview`);
  }

  previewWin.show();

  previewWin.on("closed", () => {
    previewWin = null;
  });
}

if (app.isPackaged) {
  require("./menu");
}
app.on("ready", createWindow);

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

function checkUpdate(args: Typings.CustomPublishOptionType) {
  // https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/recipes.html#auto-update
  // https://github.com/electron-userland/electron-builder/issues/4599#issuecomment-575885067
  // Override when needed
  // if (isDev) return;
  autoUpdater.setFeedURL(args);

  autoUpdater
    .checkForUpdates()
    .then((r) => {
      console.log(r);
    })
    .catch((e) => {
      console.log(e);
    });
}

autoUpdater.on("update-not-available", () => {
  win.webContents.send(StaticData.ElectronEventType.UPDATE_NOT_AVAILABLE);
});
autoUpdater.on("update-available", () => {
  win.webContents.send(StaticData.ElectronEventType.UPDATE_AVAILABLE);
});
autoUpdater.on("download-progress", (data) => {
  // https://www.electron.build/auto-update#event-download-progress
  win.webContents.send(StaticData.ElectronEventType.DOWNLOAD_PROGRESS, Math.ceil(data.percent));
});
autoUpdater.on("update-downloaded", (data) => {
  win.webContents.send(StaticData.ElectronEventType.UPDATE_DOWNLOADED, String(data.downloadedFile));
});
