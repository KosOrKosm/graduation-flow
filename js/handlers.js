/**
 * @ Author: Jacob Fano
 * @ Create Time: 2022-03-11 14:42:55
 * @ Modified by: Jacob Fano
 * @ Modified time: 2022-03-24 12:04:04
 */


// This file contains JS functions to be invoked by HTML buttons.
// 

function doLoadPrompt(onResolve) {
    const tmpInput = document.body.createElement('input')
    tmpInput.type = 'file'
    tmpInput.accept = '.json'
    tmpInput.onchange = event => {
        if (tmpInput.files.length > 0) {
            const file = Array.from(tmpInput.files)[0]
            const reader = new FileReader()
            reader.onload = event => {
                onResolve(reader.result)
            }
            reader.readAsText(file)
        }
    }
    tmpInput.click()
}

async function doFilePrompt(consumer) {
    const [fileHandle] = await window.showOpenFilePicker()
    const file = await fileHandle.getFile()
    const content = await file.text()
    consumer(content)
}


async function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    const tmpDownloader = document.createElement("a")
    const tmpURL = URL.createObjectURL(file)
    tmpDownloader.href = tmpURL
    tmpDownloader.download = filename
    tmpDownloader.click()
    setTimeout(function() {
        window.URL.revokeObjectURL(tmpURL)
    }, 0)
}

function upload() {

    doLoadPrompt((text) => {
        mainCanvas.fromJson(text)
    })

}

function onClickSave() {
    download(mainCanvas.toJson(), 'canvas.json', 'text/plain')
}

function onClickLoad() {
    upload()
}

function onClickCreateCustomNode() {
    // let btn = document.getElementById("btn-create-custom")
    let popup = document.getElementById("create-node-form-body")

    let customNode = new FlowNode(0, 300)
    customNode.className = document.getElementById("c-name-create").value
    customNode.classCode = document.getElementById("c-major-create").value
    customNode.tabColor = document.getElementById("c-color-create").value
    customNode.prereqs = document.getElementById("c-prereq-create").value.split(',')
    mainCanvas.addNode(customNode)
    mainCanvas.hideLastPopup()
    popup.reset()

}

function onClickCreate() {
    // let btn = document.getElementById("btn-create")
    // let popup = document.getElementById("create-node-form")
    
    mainCanvas.showPopup("create-node-form")

}

// Target HTML Element: modify-node-form
// Used for the button to delete the selected node
function onClickDeleteSelectedNode() {
    let popup = document.getElementById("modify-node-form-body")
    
    mainCanvas.removeSelectedNode()
    mainCanvas.hideLastPopup()
    popup.reset()
}

// Target HTML Element: modify-node-form
// Used to confirm modifications to the selected node
function onClickModifyNode() {
    let popup = document.getElementById("modify-node-form-body")

    mainCanvas.realizeNodeModifications() 
    mainCanvas.hideLastPopup()
    popup.reset()
}
