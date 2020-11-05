// Modules to control application life and create native browser window
const { app, BrowserWindow, globalShortcut, clipboard, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

const platform = process.platform;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  ipcMain.on("clipboad-multiple-get", (event) => {
    if (platform === "darwin") {
      if (clipboard.has("NSFilenamesPboardType")) {
        const res = clipboard.read("NSFilenamesPboardType");
        console.log(res);
        event.reply("clipboad-multiple-get-reply", `has NSFilenamesPboardType ${res}`);
      } else {
        console.log("no NSFilenamesPboardType");
        event.reply("clipboad-multiple-get-reply", `no NSFilenamesPboardType`);
      }
    } else {
      if (clipboard.has("CF_HDROP")) {
        const res = clipboard.readBuffer("CF_HDROP").toString("ucs2");
        console.log(res);
        event.reply("clipboad-multiple-get-reply", `has CF_HDROP ${res}`);
      } else {
        console.log("no CF_HDROP");
        event.reply("clipboad-multiple-get-reply", `no CF_HDROP`);
      }
    }
  });

  ipcMain.on("clipboad-single-get", (event) => {
    if (platform === "darwin") {
      if (clipboard.has("public.file-url")) {
        const res = clipboard.read("public.file-url");
        console.log(res);
        event.reply("clipboad-single-get-reply", `has public.file-url ${res}`);
      } else {
        console.log("no public.file-url");
        event.reply("clipboad-single-get-reply", `no public.file-url`);
      }
    } else {
      if (clipboard.has("FileNameW")) {
        const res = clipboard.readBuffer("FileNameW").toString("ucs2");
        console.log(res);
        event.reply("clipboad-single-get-reply", `has FileNameW ${res}`);
      } else {
        console.log("no FileNameW");
        event.reply("clipboad-single-get-reply", `no FileNameW`);
      }
    }
  });

  ipcMain.on("clipboad-image-get", (event) => {
    const clipboardImage = clipboard.readImage("clipboard");
    if (!clipboardImage.isEmpty()) {
      const data = clipboardImage.toPNG().toString("base64");
      console.log(data);
      event.reply("clipboad-image-get-reply", { success: true, data });
    } else {
      console.log("no clipboad-image");
      event.reply("clipboad-image-get-reply", { success: false, data: "no clipboad-image" });
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
