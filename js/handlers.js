/**
 * @ Author: Jacob Fano
 * @ Create Time: 2022-03-11 14:42:55
 * @ Modified by: Jacob Fano
 * @ Modified time: 2022-04-07 13:07:48
 */


// This file contains JS functions to be invoked by HTML buttons.
// 

async function tryUploadPrompt(onResolve) {

    // Modern download method using File System Access API
    if (window.showOpenFilePicker) {
        
        const [fileHandle] = await window.showOpenFilePicker({
            types: [{
                description: "JSON",
                accept: {
                    'application/json': ['.json']
                }
            }],
            excludeAcceptAllOptions: false,
            multiple: false
        })
        const file = await fileHandle.getFile()
        const content = await file.text()
        onResolve(content)
        return

    }

    // Backup upload method using HTML elements
    const tmpInput = document.createElement('input')
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

async function tryDownloadPrompt(data, filename, type) {
    var file = new Blob([data], {type: type})

    // Modern download method using File System Access API
    if(window.showSaveFilePicker) {
        const fileHandle = await window.showSaveFilePicker({
            suggestedName: "canvas",
            types: [{
                description: "JSON",
                accept: {
                    'application/json': ['.json']
                }
            }]
        })
        const writable = await fileHandle.createWritable()
        await writable.write(file)
        await writable.close()
        return
    }

    // Backup download method using HTML elements
    const tmpDownloader = document.createElement("a")
    const tmpURL = URL.createObjectURL(file)
    tmpDownloader.href = tmpURL
    tmpDownloader.download = filename
    tmpDownloader.click()
    setTimeout(() => {
        window.URL.revokeObjectURL(tmpURL)
    }, 0)
}

function onClickSave() {
    tryDownloadPrompt(mainCanvas.toJson(), 'canvas.json', 'text/plain')
}

function onClickLoad() {
    tryUploadPrompt((text) => mainCanvas.fromJson(text))
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
