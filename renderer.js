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

// window.electron.doThing()
window.electron.startDrop('E:/Work/qcom-Log/camera-record.log')

// var ultest = document.getElementById("ultest")

// ultest.addEventListener('click', function (e) {
//   console.log(e.target);
// })

document.getElementById('drag').ondragstart = (event) => {
  event.preventDefault()
  window.electron.startDrag('E:/Work/qcom-Log/camera-record.log')
}
document.addEventListener('dragover', (e) => {
  e.preventDefault();
  console.log("drog over")
  // e.stopPropagation();
});
document.addEventListener("drop", (e) => {
  e.preventDefault();
  textDiv.replaceChildren()  
  // e.stopPropagation();
  const files = e.dataTransfer.files;
  if (files && files.length > 0) {
    const path = files[0].path;
    console.log('path=', path);
    window.electron.startDrop(path)
  }
})
// const btn = document.getElementById("btnTest1")
// if (btn) btn.innerText = "nimei"
// btn.onclick = () => {
//   btn.innerText = "nimei2"
//   //   ipcRenderer.send('adbkit-update-devices');
//   window.electron.updatedevice()
// }

window.addEventListener('scroll', function (event, data) {
  //console.log("scroll 111", event, data)
})

// var textSpan = document.getElementById("text1")

var textDiv;
function createTextDiv()
{
  textDiv = document.createElement("div")
  textDiv.innerHTML = "test"
  textDiv.style.height = '1000000px'
  textDiv.style.backgroundColor = '#778899'
  document.body.appendChild(textDiv)
}
document.getElementById("btn1").onclick = () => {
  //计算text区域的viewport,能加载多少行?从第几行到第几行
  window.electron.startDrop('E:/Work/qcom-Log/camera-record.log')
  createTextDiv();
}

var getRandomColor = function(){
  return '#'+(Math.random()*0xffffff<<0).toString(16); 
}

//更新文字,一次更新多行
window.electron.onUpdateCounter((event, value) => {
  if (textDiv == null) createTextDiv();
  // const oldValue = Number(counter.innerText)
  // const newValue = oldValue + value
  // textSpan.innerText = value
  const splits = value.split('\n');
  for (var i = 0; i < splits.length; i++) {
    // var li = document.createElement("li")
    // li.appendChild(document.createTextNode(splits[i]))
    // ultest.appendChild(li)
    console.log("textDiv.childNodes", textDiv.childNodes.length)
    if (textDiv.childNodes.length > 10)
    {
      console.log("exceed max len 2000")
      break
    }

    var span = document.createElement("span")
    span.innerText = splits[i];
    span.style.whiteSpace =  'nowrap'
    // span.style.border = '1px'
    var div = document.createElement("div")
    div.appendChild(span)
    // div.style.backgroundColor = getRandomColor()
    // div.style.border = '2px solid blue'
    // div.style.height = '30px'
    div.className = 'box'
    div.tabIndex = i
    // div.onclick = () => {console.log("111");div.focus()}
    textDiv.appendChild(div)
  }
  //console.log("value=", value, "12345")
  //event.sender.send('counter-value', newValue)


  //创建span


})