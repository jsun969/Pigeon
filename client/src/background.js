'use strict';

import { app, protocol, BrowserWindow, ipcMain, Menu, Tray } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import { machineId } from 'node-machine-id';
import path from 'path';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }]);

let win;
async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 450,
    height: 520,
    resizable: false,
    frame: false,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      enableRemoteModule: true,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }
}

let popUpWin;
async function createPopUpWindow({ width, height }) {
  popUpWin = new BrowserWindow({
    width,
    height,
    resizable: false,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      enableRemoteModule: true,
    },
  });
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await popUpWin.loadURL(process.env.WEBPACK_DEV_SERVER_URL + 'popup');
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    await popUpWin.loadURL('app://./popup.html');
  }
  popUpWin.on('close', () => {
    popUpWin = null;
  });
}

// Quit when all windows are closed.
// app.on('window-all-closed', () => {
//   // On macOS it is common for applications and their menu bar
//   // to stay active until the user quits explicitly with Cmd + Q
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

let tray = null;
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }

  // 显示系统托盘
  tray = new Tray(path.join(__static, 'logo.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示主界面',
      type: 'normal',
      click: () => {
        win.show();
        win.focus();
      },
    },
    {
      label: '退出',
      type: 'normal',
      click: () => {
        app.quit();
      },
    },
  ]);
  tray.setToolTip('飞鸽传书');
  tray.setContextMenu(contextMenu);

  createWindow();

  // 发送设备代码
  ipcMain.on('getPcId', async event => {
    event.returnValue = await machineId();
  });

  // 打开弹窗
  let databaseId;
  ipcMain.on('createPopUp', (event, { width, height, id }) => {
    createPopUpWindow({ width, height });
    databaseId = id;
  });

  // 获取弹窗的服务端ID
  ipcMain.on('getDatabaseID', event => {
    event.returnValue = databaseId;
  });
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
