/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

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

// var ultest = document.getElementById("ultest")

// ultest.addEventListener('click', function (e) {
//   console.log(e.target);
// })
var eleDrag = document.getElementById('drag')
if (eleDrag != null) {
  eleDrag.ondragstart = (event) => {
    ent.preventDefault()
  }
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
  // console.log("scroll 111", event, data)
  console.log('Current position:', window.scrollY, "height:", window.innerHeight);
  // window.electron.startDrop('E:/Work/qcom-Log/camera-record.log')
  var pixelPerLine = 20;
  var startOfLine = Math.floor(window.scrollY / pixelPerLine);
  window.electron.mainUpdate(startOfLine)
})

// var textSpan = document.getElementById("text1")

var textDiv;
function createTextDiv() {
  textDiv = document.createElement("div")
  textDiv.innerHTML = "test"
  textDiv.style.height = '1000000000px'
  textDiv.style.backgroundColor = '#778899'
  document.body.appendChild(textDiv)
}

var eleBtn1 = document.getElementById("btn1")
if (eleBtn1 != null) {
  eleBtn1.onclick = () => {
    //计算text区域的viewport,能加载多少行?从第几行到第几行
    window.electron.startDrop('E:/Work/qcom-Log/camera-record.log')
    ceateTextDiv();
  }
}

var getRandomColor = function(){
  return '#'+(Math.random()*0xffffff<<0).toString(16); 
}

window.electron.startDrop('E:/Work/qcom-Log/camera-record.log')
  if (textDiv == null) createTextDiv();
//更新文字,一次更新多行
window.electron.onUpdateCounter((event, value) => {
  if (textDiv == null) createTextDiv();
  const top = window.scrollY;
  textDiv.innerHTML = ""
  const splits = value.split('\n');
  for (var i = 0; i < splits.length; i++) {
    // console.log("textDiv.childNodes", textDiv.childNodes.length)
    if (textDiv.childNodes.length > 100) {
      console.log("exceed max len 2000")
      break
    }

    var span = document.createElement("span")
    span.innerText = splits[i];
    // span.style.whiteSpace = 'nowrap'
    span.classList.add('for_text')

    var div = document.createElement("div")
    div.appendChild(span)
    div.className = 'box'
    div.tabIndex = i
    div.style.position = 'absolute';
    div.style.top = `${top + i * 20}px`;
    textDiv.appendChild(div)
  }

})