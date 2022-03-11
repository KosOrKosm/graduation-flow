

function onClickCreateCustomNode() {
    // let btn = document.getElementById("btn-create-custom")
    // let popup = document.getElementById("create-node-form")

    window.mainCanvas.hideLastPopup()
    nodes.push(new FlowNode(0, 300, "orange"))

}

function onClickCreate() {
    // let btn = document.getElementById("btn-create")
    // let popup = document.getElementById("create-node-form")
    
    window.mainCanvas.showPopup("create-node-form")

}

function onClickDeleteSelectedNode() {
    // let btn = document.getElementById("btn-delete")
    // let popup = document.getElementById("modify-node-form")
    
    window.mainCanvas.hideLastPopup()
    nodes = nodes.filter(item => item !== selectedNode)
    
}