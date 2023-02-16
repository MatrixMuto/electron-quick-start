/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */


document.getElementById("btn1").onclick = () => {
    window.electron.startDrag('drag-and-drop.md')
}

document.getElementById("btn-search").onclick = () => {
    var ele = document.getElementById("input-search")
    console.log(ele.value)
    window.electron.search(ele.value)
}

const counter = document.getElementById('text1')

window.electron.onUpdateCounter((event, value) => {
    // const oldValue = Number(counter.innerText)
    // const newValue = oldValue + value
    counter.innerText = value
    console.log("value=", value, "12345")
    //event.sender.send('counter-value', newValue)
})

window.addEventListener('scroll',function(event, data){ 
    console.log("scroll 111", event, data)
})
