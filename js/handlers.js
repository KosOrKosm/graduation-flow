/**
 * @ Author: Jacob Fano
 * @ Create Time: 2022-03-11 14:42:55
 * @ Modified by: Jacob Fano
 * @ Modified time: 2022-03-11 16:24:34
 */


// This file contains JS functions to be invoked by HTML buttons.
// 

function onClickCreateCustomNode() {
    // let btn = document.getElementById("btn-create-custom")
    // let popup = document.getElementById("create-node-form")

    mainCanvas.addNode(new FlowNode(0, 300, "orange"))
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
