import { app, BrowserWindow, Menu } from "electron";
import { ipcWebContentsSend, isDev } from "./utils.js";


export function createMenu(mainWindow: BrowserWindow){
    Menu.setApplicationMenu(
        Menu.buildFromTemplate([
            {
                label: process.platform === 'darwin' ? undefined : 'App',
                type: 'submenu',
                submenu: [
                    {
                        label: 'DevTools',
                        click: () => mainWindow.webContents.openDevTools(),
                        visible: isDev(),
                    },
                    {
                        label: 'Quit',
                        click: () => app.quit(),
                    },
                ]
            },
            {
                label: 'View',
                type: 'submenu',
                submenu: [
                    {
                        label: 'CPU',
                        click: () => ipcWebContentsSend('changeView', mainWindow.webContents, 'CPU'),
                    },
                    {
                        label: 'RAM',
                        click: () => ipcWebContentsSend('changeView', mainWindow.webContents, 'RAM'),
                    },
                    {
                        label: 'Storage',
                        click: () => ipcWebContentsSend('changeView', mainWindow.webContents, 'STORAGE'),
                    },
                ]
            },
        ])
    )
}