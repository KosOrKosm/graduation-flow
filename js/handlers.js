/**
 * @ Author: Jacob Fano
 * @ Create Time: 2022-03-11 14:42:55
 * @ Modified by: Jacob Fano
 * @ Modified time: 2022-04-14 11:32:51
 */


// This file contains JS functions to be invoked by HTML buttons.
// 

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
    customNode.classPrefixNumber = document.getElementById("c-prefixnum-create").value
    customNode.className = document.getElementById("c-name-create").value
    customNode.classUnit = document.getElementById("c-unit-create").value
    customNode.classCode = document.getElementById("c-major-create").value
    customNode.classDescription = document.getElementById("c-description-create").value
    customNode.tabColor = document.getElementById("c-color-create").value
    customNode.prereqs = document.getElementById("c-prereq-create").value.split(',')
    mainCanvas.addNode(customNode)
    popupManager.hideLastPopup()
    popup.reset()

}

function onClickCreate() {
    // let btn = document.getElementById("btn-create")
    // let popup = document.getElementById("create-node-form")
    
    popupManager.showPopup("create-node-form")

}

let selectedNode = null

function selectNode(node) { 
    selectedNode = node
}

function removeSelectedNode() {
    if (selectedNode == null)
        throw "No node selected!"
    mainCanvas.removeNode(selectedNode)
}

function realizeNodeModifications() {
    if (selectedNode == null)
        throw "No node selected!"
    selectedNode.classPrefixNumber = document.getElementById("c-prefixnum-modify").value
    selectedNode.className = document.getElementById("c-name-modify").value
    selectedNode.classUnit = document.getElementById("c-unit-modify").value
    selectedNode.classCode = document.getElementById("c-major-modify").value //need to fix .classCode to .classMajor
    selectedNode.classDescription = document.getElementById("c-description-modify").value
    selectedNode.tabColor = document.getElementById("c-color-modify").value
    selectedNode.prereqs = document.getElementById("c-prereq-modify").value.split(',')
}


// Target HTML Element: modify-node-form
// Used for the button to delete the selected node
function onClickDeleteSelectedNode() {
    let popup = document.getElementById("modify-node-form-body")
    
    removeSelectedNode()
    popupManager.hideLastPopup()
    document.getElementById('modify-node-form-over').style.display='none'
    popup.reset()
}

// Target HTML Element: modify-node-form
// Used to confirm modifications to the selected node
function onClickModifyNode() {
    

    let popup = document.getElementById("modify-node-form-body")

    realizeNodeModifications() 
    popupManager.hideLastPopup()
    document.getElementById('modify-node-form-over').style.display='none'
    popup.reset()
    
    
    
    
}
