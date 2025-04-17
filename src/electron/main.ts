import { app, BrowserWindow, ipcMain, Menu, Tray } from "electron";
import path from "path";
import { isDev, ipcMainHandle, ipcMainOn } from "./utils.js";
import { getCpuUsage, getRamUsage, getStaticData, getStorageData, pollResources, } from "./resourceManager.js";
import { getAssetPath, getPreloadPath, getUIPath } from "./pathResolver.js";
import { createTray } from "./tray.js";
import { createMenu } from "./menu.js";
import { logSystemMetrics } from "./systemLogger.js";


// Disable default menu bar
// Menu.setApplicationMenu(null); 

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
  });
  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadURL(getUIPath());
  }

  pollResources(mainWindow);
 

  ipcMainHandle('getStaticData', () => getStaticData());

  ipcMainOn('sendFrameAction', (payload) => {
    switch (payload) {
      case 'CLOSE':
        mainWindow.close();
        break;
      case 'MAXIMIZE':
        mainWindow.maximize();
        break;
      case 'MINIMIZE':
        mainWindow.minimize();
        break;
    }
  });

  ipcMain.handle('get-logs', async () => {
    return logSystemMetrics(getCpuUsage, getRamUsage, getStorageData);
   });

 

  createTray(mainWindow);

handleCloseEvents(mainWindow);
createMenu(mainWindow);

});

function handleCloseEvents(mainWindow: BrowserWindow) {
  let willClose = false;

  mainWindow.on('close', (e) => {
    if (willClose) {
      return;
    }
    e.preventDefault();
    mainWindow.hide();
    if (app.dock) {
      app.dock.hide();
    }
  });

  app.on('before-quit', () => {
    willClose = true;
  });

  mainWindow.on('show', () => {
    willClose = false;
  });
}