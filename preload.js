// window.addEventListener('DOMContentLoaded', () => {
//     const replaceText = (selector, text) => {
//         const element = document.getElementById(selector)
//         if (element) element.innerText = text
//     }
//
//     for (const dependency of ['chrome', 'node', 'electron']) {
//         replaceText(`${dependency}-version`, process.versions[dependency])
//     }
// })


const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    ping: () => ipcRenderer.invoke('ping'),
})

contextBridge.exposeInMainWorld('screen_api', {
    setTitle: (title) => ipcRenderer.invoke('setTitle', title),
    setScreenSize: (w, h) => ipcRenderer.invoke('setScreenSize', w, h)
})

contextBridge.exposeInMainWorld(
    'data_api', {
        getStore: (k) => ipcRenderer.invoke("getStore", k),
        setStore: (k, v) => ipcRenderer.invoke("setStore", k, v),
        deleteStore: (k) => ipcRenderer.invoke("setStore", k, v),
        clearStore: () => ipcRenderer.invoke("clearStore", k, v),
    });
