/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

// window.addEventListener('DOMContentLoaded', () => {
//     // const replaceText = (selector, text) => {
//     //   const element = document.getElementById(selector)
//     //   if (element) element.innerText = text
//     // }

//     // for (const type of ['chrome', 'node', 'electron']) {
//     //   replaceText(`${type}-version`, process.versions[type])
//     // }

//     console.log("????????")
//     const btn = document.getElementById("btnTest1")
//     if (btn) btn.innerText = "nimei"
//     btn.onclick = ()=>{
//       ipcRenderer.send('adbkit-update-devices');
//     }
//   })


// var term = new Terminal();
// term.open(document.getElementById('terminal'));

// term.onData(e => {
//   window.electron.termsend(e);
// });

// window.electron.termshow((event, value) => {
//   //console.log("Rendere:", value)
//   term.write(value)
// })

window.electron.doThing()
var ultest = document.getElementById("ultest")

ultest.addEventListener('click', function (e) {
  console.log(e.target);
})

document.getElementById('drag').ondragstart = (event) => {
  event.preventDefault()
  window.electron.startDrag('drag-and-drop-1.md')
}
document.getElementById('drop').addEventListener('dragover', (e) => {
  e.preventDefault();
  // e.stopPropagation();
});
document.getElementById('drop').addEventListener("drop", (e) => {
  e.preventDefault();
  // e.stopPropagation();
  const files = e.dataTransfer.files;
  if (files && files.length > 0) {
    const path = files[0].path;
    console.log('path=', path);
    window.electron.startDrop(path)
  }
})





const btn = document.getElementById("btnTest1")
if (btn) btn.innerText = "nimei"
btn.onclick = () => {
  btn.innerText = "nimei2"
  //   ipcRenderer.send('adbkit-update-devices');
  window.electron.updatedevice()
}

window.addEventListener('scroll', function (event, data) {
  //console.log("scroll 111", event, data)
})




var textSpan = document.getElementById("text1")

var textDiv;


document.getElementById("btn1").onclick = () => {
  //计算text区域的viewport,能加载多少行?从第几行到第几行
  window.electron.startDrop()

  //创建logViewer的div
  textDiv = document.createElement("div")
  textDiv.innerHTML = "test"
  document.body.appendChild(textDiv)
}

//更新文字,一次更新多行
window.electron.onUpdateCounter((event, value) => {
  // const oldValue = Number(counter.innerText)
  // const newValue = oldValue + value
  //textSpan.innerText = value
  const splits = value.split('\n');
  for (var i = 0; i < splits.length; i++) {
    // var li = document.createElement("li")
    // li.appendChild(document.createTextNode(splits[i]))
    // ultest.appendChild(li)
    console.log("textDiv.childNodes", textDiv.childNodes.length)
    if (textDiv.childNodes.length > 2000)
    {
      console.log("exceed max len 2000")
      break
    }

    var span = document.createElement("span")
    span.innerText = i +":" + splits[i];
    var div = document.createElement("div")
    div.appendChild(span)
  
    textDiv.appendChild(div)
  }
  //console.log("value=", value, "12345")
  //event.sender.send('counter-value', newValue)


  //创建span


})