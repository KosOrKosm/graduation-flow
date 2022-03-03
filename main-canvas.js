

class FlowNode {

    static sizeX = 100
    static sizeY = 70
    static tabSizeY = 20
    static textPadding = 3

    constructor(tabColor) {

        this.x = 0
        this.y = 0
        this.beingDragged = false
        this.tabColor = tabColor

    }

    setX(newX) {
        this.x = newX
    }

    setY(newY) {
        this.y = newY
    }

    isInVolume(_x, _y) {
        return  this.x <= _x && 
                this.y <= _y && 
                this.x + FlowNode.sizeX >= _x && 
                this.y + FlowNode.tabSizeY >= _y
    }

    draw() {
        fill('white')
        rect(this.x, this.y, FlowNode.sizeX, FlowNode.sizeY, 5)
        fill(this.tabColor)
        rect(this.x, this.y, FlowNode.sizeX, FlowNode.tabSizeY, 5)

        textSize(FlowNode.tabSizeY - FlowNode.textPadding * 2)
        textAlign(CENTER, TOP)
        fill('black')
        text(
            "MATH101", 
            this.x + FlowNode.textPadding,
            this.y + FlowNode.textPadding,
            FlowNode.sizeX - FlowNode.textPadding * 2,
            FlowNode.sizeY - FlowNode.textPadding * 2,
        )
        textAlign(CENTER, CENTER)
        text(
            "Introduction to Mathmatics", 
            this.x + FlowNode.textPadding,
            this.y + FlowNode.tabSizeY + FlowNode.textPadding,
            FlowNode.sizeX - FlowNode.textPadding * 2,
            FlowNode.sizeY - FlowNode.tabSizeY - FlowNode.textPadding,
        )
    }
}

var canvas = null
let nodes = []
let currently_dragged = null
let drag_offx = 0, drag_offy = 0

function setup() {

    let canvasRegion = document.getElementById("canvas-region").getBoundingClientRect()
    canvas = createCanvas(windowWidth - canvasRegion.left, windowHeight - canvasRegion.top - 70);
    canvas.parent("canvas-region")
    canvas.style("display","table-row")
    canvas.style("width","100%")

    let testNodeColors = ["maroon", "violet", "cyan", "green", "orange"]
    for(let i = 0; i < 10; ++i) {
        nodes.push(new FlowNode(testNodeColors[i % testNodeColors.length]))
        nodes[i].setX(i * 100)
    }

}

function windowResized() {
    
    let canvasRegion = document.getElementById("canvas-region").getBoundingClientRect()
    resizeCanvas(windowWidth - canvasRegion.left, windowHeight - canvasRegion.top - 70);
    canvas.style("width","100%")
}

function draw() {

    background(220);

    for (node of nodes) {
        node.draw()
    }

}

function mousePressed() {

    if (currently_dragged == null) {
        for (node of nodes) {
            if (node.isInVolume(mouseX, mouseY)) {
                drag_offx = mouseX - node.x
                drag_offy = mouseY - node.y
                currently_dragged = node
            }
        }
        
    }

}

function mouseDragged() {

    if (currently_dragged != null) {
        currently_dragged.setX(mouseX - drag_offx)
        currently_dragged.setY(mouseY - drag_offy)
    }

}


function mouseReleased() {
    currently_dragged = null
}