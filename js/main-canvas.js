class FlowNode {

    // Public node fields
    x = 0
    y = 0

    className = "Introduction to Mathmatics"
    classCode = "MATH101"

    // Private + static node fields
    static #sizeX = 100
    static #sizeY = 70
    static #tabSizeY = 20
    static #textPadding = 3

    constructor(x, y, tabColor) {

        this.x = x
        this.y = y
        this.tabColor = tabColor

    }

    isInVolume(_x, _y) {
        return  this.x <= _x && 
                this.y <= _y && 
                this.x + FlowNode.#sizeX >= _x && 
                this.y + FlowNode.#sizeY >= _y
    }

    isInTabVolume(_x, _y) {
        return  this.x <= _x && 
                this.y <= _y && 
                this.x + FlowNode.#sizeX >= _x && 
                this.y + FlowNode.#tabSizeY >= _y
    }

    draw() {
        stroke('rgb(0,0,0)')
        strokeWeight(2)
        fill('white')
        rect(this.x, this.y, FlowNode.#sizeX, FlowNode.#sizeY, 5)
        fill(this.tabColor)
        rect(this.x, this.y, FlowNode.#sizeX, FlowNode.#tabSizeY, 5)

        strokeWeight(0)
        textSize(FlowNode.#tabSizeY - FlowNode.#textPadding * 2)
        textAlign(CENTER, TOP)
        fill('black')
        text(
            this.classCode, 
            this.x + FlowNode.#textPadding,
            this.y + FlowNode.#textPadding,
            FlowNode.#sizeX - FlowNode.#textPadding * 2,
            FlowNode.#sizeY - FlowNode.#textPadding * 2,
        )
        textAlign(CENTER, CENTER)
        text(
            this.className, 
            this.x + FlowNode.#textPadding,
            this.y + FlowNode.#tabSizeY + FlowNode.#textPadding,
            FlowNode.#sizeX - FlowNode.#textPadding * 2,
            FlowNode.#sizeY - FlowNode.#tabSizeY - FlowNode.#textPadding,
        )
    }
}

var canvas = null
let nodes = []
let dragging = false
let currently_dragged = null
let drag_offx = 0, drag_offy = 0
let fadeForeground = false
let fadeForegroundAlpha = 0
let fadeForegroundAlphaTarget = 0.5
let curPopup = true
let selectedNode = null

function setup() {

    let canvasRegion = document.getElementById("canvas-region").getBoundingClientRect()
    canvas = createCanvas(windowWidth - canvasRegion.left, windowHeight - canvasRegion.top - 70);
    canvas.parent("canvas-region")
    canvas.style("width","100%")

    let testNodeColors = ["maroon", "violet", "cyan", "green", "orange"]
    for(let i = 0; i < 10; ++i) {
        nodes.push(new FlowNode(i * 100, 0, testNodeColors[i % testNodeColors.length]))
    }

}

function windowResized() {
    
    let canvasRegion = document.getElementById("canvas-region").getBoundingClientRect()
    resizeCanvas(windowWidth - canvasRegion.left, windowHeight - canvasRegion.top - 70);
    canvas.style("width","100%")
}

function draw() {

    clear()

    for (node of nodes) {
        node.draw()
    }

    if (fadeForeground) {

        if(fadeForegroundAlpha < fadeForegroundAlphaTarget)
            fadeForegroundAlpha += fadeForegroundAlphaTarget / 7

        fill(`rgba(0,0,0,${fadeForegroundAlpha})`);
        rect(-2, -2, windowWidth, windowHeight)

    }

}

function mousePressed() {

    if (fadeForeground) {

    } else {

        if (currently_dragged == null) {
            for (node of nodes) {
                if (node.isInTabVolume(mouseX, mouseY)) {
                    drag_offx = mouseX - node.x
                    drag_offy = mouseY - node.y
                    currently_dragged = node
                }
            }
            
        }

    }

}

function mouseDragged() {

    dragging = true

    if (currently_dragged != null) {
        currently_dragged.x = (mouseX - drag_offx)
        currently_dragged.y = (mouseY - drag_offy)
    }

}


function mouseReleased() {

    if (fadeForeground) {

        fadeForegroundAlpha = 0
        fadeForeground = false
        curPopup.style.display="none"
        curPopup = null

    } else if (!dragging) {

        for (node of nodes) {
            if (node.isInVolume(mouseX, mouseY)) {
                curPopup = document.getElementById("modify-node-form")
                curPopup.style.display="block"
                fadeForeground = true
                selectedNode = node
                //nodes = nodes.filter(item => item !== node)
                break
            }
        }

    }

    dragging = false
    currently_dragged = null

}


function create() {
    nodes.push(new FlowNode(0, 300, "orange"))
}

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
    curPopup = popup
    fadeForeground = true
}

function onClickDeleteSelectedNode() {
    let btn = document.getElementById("btn-delete")
    let popup = document.getElementById("modify-node-form")
    
    nodes = nodes.filter(item => item !== selectedNode)
    popup.style.display="none"
}

function openForm() {
  document.getElementById("create-node-form").style.display = "block";
}

function closeForm() {
  document.getElementById("create-node-form").style.display = "none";
}



