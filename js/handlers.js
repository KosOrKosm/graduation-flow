/**
 * @ Author: Jacob Fano
 * @ Create Time: 2022-03-11 14:42:55
 * @ Modified by: Jacob Fano
 * @ Modified time: 2022-03-15 15:18:52
 */


// This file contains JS functions to be invoked by HTML buttons.
// 

function onClickCreateCustomNode() {
    // let btn = document.getElementById("btn-create-custom")
    let popup = document.getElementById("create-node-form")

    let customNode = new FlowNode(0, 300, "orange")
    customNode.className = ""+document.getElementById("c-name-create").value
    customNode.classCode = ""+document.getElementById("c-major-create").value
    customNode.tabColor = ""+document.getElementById("c-color-create").value
    mainCanvas.addNode(customNode)
    mainCanvas.hideLastPopup()

}

function onClickCreate() {
    // let btn = document.getElementById("btn-create")
    // let popup = document.getElementById("create-node-form")
    
    mainCanvas.showPopup("create-node-form")

}

function onClickDeleteSelectedNode() {
    // let btn = document.getElementById("btn-delete")
    // let popup = document.getElementById("modify-node-form")
    
    mainCanvas.removeSelectedNode()
    mainCanvas.hideLastPopup()
    
}

function onClickModifyNode() {
    // TODO: logic to modify node
    mainCanvas.hideLastPopup()
}
