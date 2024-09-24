const {app, BrowserWindow, ipcMain} = require('electron/main')
const path = require('node:path')
const Store = require('electron-store')

const storeData = new Store({name: "data"})

const createWindow = () => {
    const win = new BrowserWindow({
        height: 600,
        width: 610,
        // minHeight: 100,
        minWidth: 610,
        // maxHeight: 650,
        maxWidth: 610,
        // useContentSize: true,
        // frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
    })
    win.setAlwaysOnTop(true, "screen-saver")
    win.setMenuBarVisibility(false); // ctrl+shift+I でdevTool開ける
    win.loadFile('index.html')

    // developper tool を開く
    // win.webContents.openDevTools();

}

app.whenReady().then(() => {
    ipcMain.handle('ping', () => 'pong')
    createWindow()
})

//////////////////////////////////////////////////////////////////////
// control
//////////////////////////////////////////////////////////////////////
ipcMain.handle('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('activate', () => {
    if (process.platform !== 'darwin') app.quit()
})

//////////////////////////////////////////////////////////////////////
// window
//////////////////////////////////////////////////////////////////////
ipcMain.handle('setTitle', (event, title) => {
    console.log(title);
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(title)
})

ipcMain.handle('setScreenSize', (event, w, h) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setSize(w, h)
})
// win.setSize(300, 200, faldse)
// win.center()

//////////////////////////////////////////////////////////////////////
// store
//////////////////////////////////////////////////////////////////////
ipcMain.handle('getStore', async (event, k) => {
    return storeData.get(k, []);//ToDoListがあれば取り出し、なければからのリストを返す
});

ipcMain.handle("setStore", async (event, k, v) => {
    storeData.set(k, v);       // 保存
});

ipcMain.handle("deleteStore", async (event, k) => {
    storeData.delete(k);       // 保存
});

ipcMain.handle("clearStore", async (event) => {
    storeData.clear();       // 保存
});


