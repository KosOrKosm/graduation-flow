/**
 * @ Author: Jacob Fano
 * @ Create Time: 2022-03-11 14:42:55
 * @ Modified by: Jacob Fano
 * @ Modified time: 2022-03-15 15:19:37
 */

/**
 *  Describes a single node in the flowchart
 *  Contains all the data describing that node, as well as
 *  functions for rendering + interacting with the node.
 *  TODO: move to a seperate file
 */
class FlowNode {

    // PUBLIC
    x = 0
    y = 0

    className = "Introduction to Mathmatics"
    classCode = "MATH101"
    tabColor = 'orange'

    // PRIVATE
    static #sizeX = 100
    static #sizeY = 70
    static #tabSizeY = 20
    static #textPadding = 3

    constructor(x, y) {

        this.x = x
        this.y = y

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

/**
 * This object contains all the app's runtime data
 * and P5 rendering hooks.
 */
class MainCanvas {

    // PRIVATE
    #canvas
    #nodes = []
    #dragging = false
    #currently_dragged = null
    #drag_offx = 0
    #drag_offy = 0
    #fadeForeground = false
    #fadeForegroundAlpha = 0
    #fadeForegroundAlphaTarget = 0.5
    #curPopup = null
    #curNode = null

    constructor() {

        // TEST NODES
        let testNodeColors = ["maroon", "violet", "cyan", "green", "orange"]
        for(let i = 0; i < 10; ++i) {
            let node = new FlowNode(i * 100, 0)
            node.tabColor = testNodeColors[i % testNodeColors.length]
            this.addNode(node)
        }
    
    }

    addNode(node) {
        this.#nodes.push(node)
    }

    removeNode(node) {
        this.#nodes = this.#nodes.filter(item => item !== node)
    }

    removeSelectedNode() {
        if (this.#curNode == null)
            throw "No node selected!"
        this.removeNode(this.#curNode)
    }

    /**
     * ======= P5 Renderer Hook =======
     * This function is invoked when P5 begins rendering.
     * The canvas should be created here.
     */
    setup() {

        let canvasRegion = document.getElementById("canvas-region").getBoundingClientRect()
        this.#canvas = createCanvas(windowWidth - canvasRegion.left, windowHeight - canvasRegion.top - 8);
        this.#canvas.parent("canvas-region")

        // Auto-lock the canvas to the max width it can occupy
        // NOTE: this will not override the canvas's actual 
        //       pixel width, just stretch to fit the screen
        this.#canvas.style("width","100%")
    }
    
    /**
     * ======= P5 Renderer Hook =======
     * This function is invoked whenever the browser window is resized.
     * The canvas should be resized to fit the new window here.
     */
    windowResized() {
        
        let canvasRegion = document.getElementById("canvas-region").getBoundingClientRect()
        resizeCanvas(windowWidth - canvasRegion.left, windowHeight - canvasRegion.top - 8);
        
        // Auto-lock the canvas to the max width it can occupy
        // NOTE: this will not override the canvas's actual 
        //       pixel width, just stretch to fit the screen
        this.#canvas.style("width","100%")
    }
    
    /**
     * ======= P5 Renderer Hook =======
     * This function is invoked to draw each new frame by P5.
     * Framerate is ~20 FPS by default
     * 
     * If the nodes have been modified in any way since last draw,
     * this should redraw the tree. 
     * 
     * Currently, we just redraw every frame since that is safer.
     */
    draw() {
    
        clear()
    
        for (let node of this.#nodes) {
            node.draw()
        }
    
        if (this.#fadeForeground) {
    
            if(this.#fadeForegroundAlpha < this.#fadeForegroundAlphaTarget)
                this.#fadeForegroundAlpha += this.#fadeForegroundAlphaTarget / 7
    
            fill(`rgba(0,0,0,${this.#fadeForegroundAlpha})`);
            rect(-2, -2, windowWidth, windowHeight)
    
        }
    
    }
    
    /**
     * ======= P5 Renderer Hook =======
     * This function is invoked whenever the mouse is:
     *      Pressed (ie. starting to click) 
     * anywhere in the browser
     */
    mousePressed() {
    
        if (this.#fadeForeground) {
    
        } else {
    
            if (this.#currently_dragged == null) {
                for (let node of this.#nodes) {
                    if (node.isInTabVolume(mouseX, mouseY)) {
                        this.#drag_offx = mouseX - node.x
                        this.#drag_offy = mouseY - node.y
                        this.#currently_dragged = node
                    }
                }
                
            }
    
        }
    
    }
    
    /**
     * ======= P5 Renderer Hook =======
     * This function is invoked whenever the mouse is:
     *      Dragged (ie. moved during a press but before release) 
     * anywhere in the browser
     */
    mouseDragged() {
    
        this.#dragging = true
    
        if (this.#currently_dragged != null) {
            this.#currently_dragged.x = (mouseX - this.#drag_offx)
            this.#currently_dragged.y = (mouseY - this.#drag_offy)
        }
    
    }
    
    /**
     * ======= P5 Renderer Hook =======
     * This function is invoked whenever the mouse is:
     *      Released (ie. ending a click or drag) 
     * anywhere in the browser
     */
    mouseReleased() {
    
        if (this.#fadeForeground) {
    
        } else if (!this.#dragging) {
    
            for (let node of this.#nodes) {
                if (node.isInVolume(mouseX, mouseY)) {
                    this.showPopup("modify-node-form")
                    this.#curNode = node
                    break
                }
            }
    
        }
    
        this.#dragging = false
        this.#currently_dragged = null
    
    }

    // Hides the last popup the canvas is aware of being displayed
    hideLastPopup() {
        this.#fadeForegroundAlpha = 0
        this.#fadeForeground = false
        this.#curPopup.style.display="none"
        this.#curPopup = null
    }

    // Shows a given popup
    showPopup(popupName) {
        this.#curPopup = document.getElementById(popupName)
        this.#curPopup.style.display="block"
        this.#fadeForeground = true
    }
    
}

mainCanvas = new MainCanvas()

// Mount main canvas functions to the locations p5 expects them
window.setup = mainCanvas.setup.bind(mainCanvas)
window.draw = mainCanvas.draw.bind(mainCanvas)
window.windowResized = mainCanvas.windowResized.bind(mainCanvas)
window.mousePressed = mainCanvas.mousePressed.bind(mainCanvas)
window.mouseDragged = mainCanvas.mouseDragged.bind(mainCanvas)
window.mouseReleased = mainCanvas.mouseReleased.bind(mainCanvas)

