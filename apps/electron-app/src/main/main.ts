// src/main/main.ts

import { app, BrowserWindow, ipcMain, clipboard, session, Menu, MenuItem } from "electron";
import { join, } from "path";
import * as path from 'path';

import Store from "electron-store";

// Disable hardware acceleration before any other Electron APIs are called
app.disableHardwareAcceleration();

const store = new Store();

// This will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    backgroundColor: "#00000000", // Set background color to transparent
    webPreferences: {
      // Preload the content from 'preload.js'.
      preload: join(__dirname, "preload.js"),
      // Enable Node integration.
      nodeIntegration: false, // we want this to be false for security reasons
      // Enable context isolation.
      contextIsolation: true,
    },
  });

  // Load the index.html file.
  if (process.env.NODE_ENV === "development") {
    // If we're in development mode, load the index.html file of the
    // renderer from the localhost server
    mainWindow.webContents.openDevTools(); // open dev tools

    const rendererPort = process.argv[2];
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
  } else { // no dev, this is for PRODUCTION
    // Otherwise, load the index.html file of the renderer from the
    // file system.
    //mainWindow.webContents.openDevTools(); // open dev tools
    mainWindow.loadFile(join(app.getAppPath(), "renderer", "index.html"));
  }
  return mainWindow
}

function registerIpcHandlers(store: Store) {
  ipcMain.handle("electron-store-get", async (event, val) => {
    return store.get(val);
  });

  ipcMain.handle("electron-store-set", async (event, key, val) => {
    store.set(key, val);
  });

  ipcMain.handle('get-config-path', () => {
    const userDataPath = app.getPath('userData');
    const configFilePath = path.join(userDataPath, 'config.json');
    return configFilePath;
  });

  ipcMain.handle("clipboard-write", (event, text) => {
    clipboard.writeText(text);
  });
}

function createNavigationMenu(mainWindow) {
  if (!mainWindow) return;


  const defaultMenu = Menu.getApplicationMenu();
  if (!defaultMenu) return;

  const items = [...defaultMenu.items];

  // Define the routes you want to navigate to
  // For example, let's assume your five main routes are:
  // /privatize, /prompt-manager, /rules, /setup, /info

  const customMenuItem = new MenuItem({

    label: "Navigation",
    submenu: [
      {
        label: "Go to Privatize",
        accelerator: "CmdOrCtrl+1",
        click: () => {
          // Send a message to the renderer to navigate
          mainWindow?.webContents.send("navigate", "privatize");
        }
      },
      {
        label: "Go to Prompt Manager",
        accelerator: "CmdOrCtrl+2",
        click: () => {
          mainWindow?.webContents.send("navigate", "prompt-manager");
        }
      },
      {
        label: "Go to Rules",
        accelerator: "CmdOrCtrl+3",
        click: () => {
          mainWindow?.webContents.send("navigate", "rules");
        }
      },
      {
        label: "Go to Setup",
        accelerator: "CmdOrCtrl+4",
        click: () => {
          mainWindow?.webContents.send("navigate", "setup");
        }
      },
      {
        label: "Go to Info",
        accelerator: "CmdOrCtrl+5",
        click: () => {
          mainWindow?.webContents.send("navigate", "info");
        }
      },
    ],
  });

  // Finde das "Help"-Menü
  const helpMenu = items.find(item => item.role === "help");
  if (helpMenu && helpMenu.submenu) {
    helpMenu.submenu.append(new MenuItem({
      label: "Info",
      click: () => {
        mainWindow?.webContents.send("navigate", "info");
      }
    }));
  }

  items.splice(items.length - 1, 0, customMenuItem);
  const newMenu = new Menu();
  items.forEach((item) => newMenu.append(item));
  Menu.setApplicationMenu(newMenu);
}

// This function will be called when Electron is ready, and should be used
// to create browser windows.
app.whenReady().then(() => {

  // Register IPC handlers **once**:
  registerIpcHandlers(store);
  const mainWindow = createWindow();
  createNavigationMenu(mainWindow);

  // Set up default session to restrict content security policy.
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": ["script-src 'self'"],
      },
    });
  });

  // This function will be called when the application has finished
  // launching and is ready for interaction.
  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's
// common to re-create a window in the app when the dock icon is clicked,
// and thus, we should not quit.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// Renderer process messaging
ipcMain.on("message", (event, message) => {
  console.log(message);
});
