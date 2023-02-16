// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('path')
const { Adb } = require("@devicefarmer/adbkit")
const client = Adb.createClient();
const ipcMain = require('electron').ipcMain;
const fs = require('fs')
const https = require('https')


var data = ' '
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()


  ipcMain.on('file-drop', function (event, arg) {
    console.log("file-drop")
    const MAX_LEN = 70000;//((1 << 8) - 24)
    var stream = fs.createReadStream('E:/Work/qcom-Log/camera-record.log')
    stream.on('data', function (chunk) {
      if (data.length + chunk.length < MAX_LEN)
        data += chunk;
      // console.log("data length=", data.length, "chunk len=", chunk.length)
    });
    stream.on('end', function () {
      console.log("read end");
      mainWindow.webContents.send('updateText', data)
    })
  })

  ipcMain.on('search', function (event, arg) {
    console.log("search", event, arg)
    var result = data.split("\n").filter(line => line.indexOf(arg) > -1);
    mainWindow.webContents.send('sendText', result)
  })

}
const iconName = path.join(__dirname, 'iconForDragAndDrop.png');
const icon = fs.createWriteStream(iconName);

fs.writeFileSync(path.join(__dirname, 'drag-and-drop-1.md'), '# First file to test drag and drop')
https.get('https://img.icons8.com/ios/452/drag-and-drop.png', (response) => {
  response.pipe(icon);
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('adbkit-update-devices', function (event, arg) {
  console.log("11234")
  updateDevices(event, arg);
});

function updateDevices(event, arg) {
  console.log(`Updating device list`);
  client.listDevicesWithPaths()
    .then(function (devices) {
      event.sender.send('adbkit-devices-updated', devices);
    })
    .catch(function (err) {
      console.warn('Unable to get devices:', err.stack)
      event.sender.send('adbkit-devices-updated', []);
    });
}


ipcMain.on('do-a-thing', function (event, arg) {
  console.log("1231231231231")
})


ipcMain.on('ondragstart', (event, filePath) => {
  console.log("ondragstart")
  event.sender.startDrag({
    file: path.join(__dirname, filePath),
    icon: iconName,
  })
})