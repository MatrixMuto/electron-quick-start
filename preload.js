/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 * 
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */
// Preload (Isolated World)
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld(
  'electron',
  {
    doThing: () => ipcRenderer.send('do-a-thing'),
    startDrag: (filename) => {
      ipcRenderer.send('ondragstart', filename)
    },
    startDrop: (filename) => {
      ipcRenderer.send('file-drop', filename)
    },
    updatedevice:() => {
      ipcRenderer.send('adbkit-update-devices')
    },
    onUpdateCounter: (callback) => {ipcRenderer.on('updateText', callback)},

    termsend: (cmd) => ipcRenderer.send('terminal.keystroke', cmd),

    termshow: (data) => ipcRenderer.on('terminal.incomingData', data)
  }
)

window.addEventListener('DOMContentLoaded', () => {
  console.log("????????")
})

ipcRenderer.on('adbkit-devices-updated', (event, devices) => {
  devices.forEach((device) => onDeviceUpdated(device));
});


function onDeviceUpdated(adbKitDevice) {
  // let device = this.getDevice(adbKitDevice);
  // Object.assign(device, adbKitDevice);
  // device.onPropertiesUpdated();
  console.log('Device updated: ' + adbKitDevice.id);
  // this.dispatch(actions.deviceUpdated(device));
}


