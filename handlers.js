

function onClickCreateCustomNode() {
    let btn = document.getElementById("btn-create-custom")
    let popup = document.getElementById("create-node-form")
    nodes.push(new FlowNode(0, 300, "orange"))
    popup.style.display="none"
}

function onClickCreate() {
    let btn = document.getElementById("btn-create")
    let popup = document.getElementById("create-node-form")
    popup.style.display="block"
}