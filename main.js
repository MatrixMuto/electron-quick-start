// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, MenuItem } = require('electron')
const path = require('path')
const { Adb } = require("@devicefarmer/adbkit")
const client = Adb.createClient();
const ipcMain = require('electron').ipcMain;
const fs = require('fs')
const https = require('https')
const os = require('os')
const pty = require('node-pty')

var shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

var data = ' '

var eol_offsets = []
var line_count = 0
var gFileName = ""
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
  const menu = new Menu()
  menu.append(new MenuItem({
    role: 'term',
    accelerator: 'Ctrl+J',
    click: () => {
      console.log("123")
      // mainWindow.webContents.get
    }
  }))
  // Menu.setApplicationMenu(menu)

  //建议索引
  //   行号  offset_of_endofline
  //   1       0
  //
  ipcMain.on('file-drop', function (event, filename) {
    console.log("file-drop" + filename)
    gFileName = filename
    const MAX_LEN = 70000;//((1 << 8) - 24)
    var stream = fs.createReadStream(filename)
    chunk_offset = 0
    stream.on('data', function (chunk) {
      for (var i = 0; i < chunk.length; i++) {
        if (chunk[i] == 0xa) {
          eol_offsets[line_count++] = chunk_offset + i;
        }
      }
      chunk_offset += chunk.length
      // mainWindow.webContents.send('updateText', "" + chunk)
    });
    /*
    stream.on('readable', () => {
      for (; ;) {
        chunk = stream.read(4096 * 512)
        if (chunk == null)
          break
        console.log("" + chunk)
        for (var i = 0; i < chunk.length; i++) {
          if (chunk[i] == 0x0a) {
            eol_offsets[line_count++] = chunk_offset + i;
          }
          // console.log(chunk[i], '\n')
        }
        chunk_offset += chunk.length
      }
    })
    */
    stream.on('end', function () {
      console.log("read end, line_count=", line_count);
      stream.close()
    })
  })

  ipcMain.on('search', function (event, arg) {
    console.log("search", event, arg)
    var result = data.split("\n").filter(line => line.indexOf(arg) > -1);
    mainWindow.webContents.send('sendText', result)
  })

  // var ptyProcess = pty.spawn(shell, [], {
  //   name: 'xterm-color',
  //   cols: 80,
  //   rows: 30,
  //   cwd: process.env.HOME,
  //   env: process.env
  // });

  // ptyProcess.onData(function (data) {
  //   console.log("Data sent", data);
  //   mainWindow.webContents.send("terminal.incomingData", data);
  // });


  // ipcMain.on("terminal.keystroke", (event, key) => {
  //   ptyProcess.write(key);
  // });
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

ipcMain.on('mainUpdate', (e, startOfLine) => {
  console.log("mainUpdate ", startOfLine)
  if (startOfLine > line_count)
    return
  var offset = eol_offsets[startOfLine]
  var stream = fs.createReadStream(gFileName, { start : offset, end: (offset+4096*16)})
  var result = "" 
  stream.on('data', (chunk) => {
    result += chunk
  })

  stream.on('end',()=>{
    stream.close()
    e.sender.send('updateText', result)
  })
})