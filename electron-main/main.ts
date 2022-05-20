import { app, protocol, ipcMain, BrowserWindow } from "electron";
import { autoUpdater } from "electron-updater";
import path from "path";
import isDev from "electron-is-dev";
import remote from "@electron/remote/main";

remote.initialize();

import * as StaticData from "../src/common/static-data";
import * as Typings from "../src/typings/types";

let win: BrowserWindow | null = null;
let previewWin: BrowserWindow | null = null;

const preDefinedWidth = 1240;
const predefinedHeight = 730;

const singleInstanceLock = app.requestSingleInstanceLock();

let isPrompting = false;

app.disableHardwareAcceleration();
app.commandLine.appendSwitch("disable-site-isolation-trials");

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
    show: false,
    width: preDefinedWidth,
    height: predefinedHeight,
    minWidth: preDefinedWidth,
    minHeight: predefinedHeight,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      preload: path.join(__dirname, "../electron-preload/index.js"),
    },
  });

  win.webContents.openDevTools();

  remote.enable(win.webContents);

  if (isDev) {
    win.loadURL(
      `http://${process.env["VITE_DEV_SERVER_HOST"]}:${process.env["VITE_DEV_SERVER_PORT"]}`
    );
  } else {
    win.loadFile(path.join(__dirname, "../index.html"));
  }

  win.once("show", () => {
    isPrompting = false;
    win?.show();
  });

  // resetDevice before quit app
  win.on("close", function (e) {
    if (!isPrompting) {
      e.preventDefault();
      win?.webContents.send(StaticData.ElectronEventType.OPEN_APP_CLOSE_PROMPT);
      isPrompting = true;
    }
  });

  win.on("closed", () => {
    win = null;
  });

  app.whenReady().then(() => {
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
      if (app.isPackaged) {
        autoUpdater.quitAndInstall();
      }
    });

    ipcMain.on(StaticData.ElectronEventType.OPEN_PREVIEW, () => {
      showPreviewWindow();
    });

    ipcMain.on(StaticData.ElectronEventType.CLOSE_APP, () => {
      win?.close();
      app.quit();
    });

    ipcMain.on(StaticData.ElectronEventType.ON_CANCEL_CLOSE_PROMPT, () => {
      isPrompting = false;
    });

    ipcMain.on(StaticData.ElectronEventType.OPEN_DEVTOOLS, () => {
      win?.webContents.openDevTools({ mode: "detach" });
    });
  });

  win.webContents.on("did-finish-load", () => {
    win?.show();
    if (isDev) {
      win?.webContents.openDevTools();
    }
  });
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
    webPreferences: {
      webSecurity: false,
      webviewTag: true,
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  require("@electron/remote/main").enable(previewWin.webContents);

  if (app.isPackaged) {
    previewWin.removeMenu();
  }

  if (isDev) {
    previewWin.loadURL(
      `http://${process.env["VITE_DEV_SERVER_HOST"]}:${process.env["VITE_DEV_SERVER_PORT"]}/#/preview`
    );
  } else {
    // 'build/index.html'
    previewWin.loadURL(`file://${__dirname}/../index.html#/preview`);
  }

  previewWin.show();

  previewWin.on("closed", () => {
    previewWin = null;
  });
}

// https://www.electronjs.org/docs/api/app#appispackaged
if (app.isPackaged) {
  require("./menu");
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  ipcMain.removeAllListeners(StaticData.ElectronEventType.CLOSE_APP);
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

function checkUpdate(args: Typings.CustomPublishOptionType) {
  // https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/recipes.html#auto-update
  // https://github.com/electron-userland/electron-builder/issues/4599#issuecomment-575885067
  // Override when needed
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
  win?.webContents.send(StaticData.ElectronEventType.UPDATE_NOT_AVAILABLE);
});
autoUpdater.on("update-available", () => {
  win?.webContents.send(StaticData.ElectronEventType.UPDATE_AVAILABLE);
});
autoUpdater.on("download-progress", (data) => {
  // https://www.electron.build/auto-update#event-download-progress
  win?.webContents.send(StaticData.ElectronEventType.DOWNLOAD_PROGRESS, Math.ceil(data.percent));
});
autoUpdater.on("update-downloaded", (data) => {
  win?.webContents.send(
    StaticData.ElectronEventType.UPDATE_DOWNLOADED,
    String(data.downloadedFile)
  );
});
