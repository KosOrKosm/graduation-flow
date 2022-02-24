

var canvas = null

function setup() {

    let canvasRegion = document.getElementById("canvas-region").getBoundingClientRect()
    canvas = createCanvas(windowWidth - canvasRegion.left, windowHeight - canvasRegion.top - 70);
    canvas.parent("canvas-region")
    canvas.style("display","table-row")
    canvas.style("width","100%")
}

function windowResized() {
    
    let canvasRegion = document.getElementById("canvas-region").getBoundingClientRect()
    resizeCanvas(windowWidth - canvasRegion.left, windowHeight - canvasRegion.top - 70);
    canvas.style("width","100%")
}

class FlowNode {

    constructor() {

        this.x = 0
        this.y = 0
        this.beingDragged = false

    }

    setX(newX) {
        this.x = newX
    }

    setY(newY) {
        this.y = newY
    }

    isInVolume(_x, _y) {
        return this.x <= _x && this.y <= _y && this.x + 100 >= _x && this.y + 20 >= _y
    }

    draw() {
        fill('white')
        rect(this.x, this.y, 100, 70, 5)
        fill('maroon')
        rect(this.x, this.y, 100, 20, 5)
    }
}


let test_node = new FlowNode()
let currently_dragged = null
let drag_offx = 0, drag_offy = 0
function draw() {

    background(220);

    test_node.draw()

}

function mousePressed() {

    if (currently_dragged == null) {
        if (test_node.isInVolume(mouseX, mouseY)) {
            drag_offx = mouseX - test_node.x
            drag_offy = mouseY - test_node.y
            currently_dragged = test_node
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