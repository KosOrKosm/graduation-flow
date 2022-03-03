

class FlowNode {

    // Public node fields
    x = 0
    y = 0

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
        fill('white')
        rect(this.x, this.y, FlowNode.#sizeX, FlowNode.#sizeY, 5)
        fill(this.tabColor)
        rect(this.x, this.y, FlowNode.#sizeX, FlowNode.#tabSizeY, 5)

        textSize(FlowNode.#tabSizeY - FlowNode.#textPadding * 2)
        textAlign(CENTER, TOP)
        fill('black')
        text(
            "MATH101", 
            this.x + FlowNode.#textPadding,
            this.y + FlowNode.#textPadding,
            FlowNode.#sizeX - FlowNode.#textPadding * 2,
            FlowNode.#sizeY - FlowNode.#textPadding * 2,
        )
        textAlign(CENTER, CENTER)
        text(
            "Introduction to Mathmatics", 
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
let fadeForegroundAlpha = 0.5

function setup() {

    let canvasRegion = document.getElementById("canvas-region").getBoundingClientRect()
    canvas = createCanvas(windowWidth - canvasRegion.left, windowHeight - canvasRegion.top - 70);
    canvas.parent("canvas-region")
    canvas.style("display","table-row")
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

        fadeForeground = false

    } else if (!dragging) {

        for (node of nodes) {
            if (node.isInVolume(mouseX, mouseY)) {
                fadeForeground = true
            }
        }

    }

    dragging = false
    currently_dragged = null

}