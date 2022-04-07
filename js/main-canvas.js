/**
 * @ Author: Jacob Fano
 * @ Create Time: 2022-03-11 14:42:55
 * @ Modified by: Jacob Fano
 * @ Modified time: 2022-03-24 13:03:52
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

    className = ""
    classUnit = ""
    classCode = ""
    tabColor = "white"
    prereqs = []

    // PRIVATE
    static #sizeX = 100
    static #sizeY = 70
    static #tabSizeY = 20
    static #textPadding = 3

    constructor(x, y) {

        if(x != undefined)
            this.x = x
        if(y != undefined)
            this.y = y

    }

    getCenter() {
        const x = FlowNode.#sizeX / 2 + this.x
        const y = FlowNode.#sizeY / 2 + this.y
        return { x, y }
    }

    // Calculates where a line segment starting at lp and ending
    // at the center of the node would intersect the node's rectangle
    getIntersection(lp) {
        if(this.isInVolume(lp.x, lp.y))
            return undefined
        else {

            let hitX = 0, hitY = 0
            const center = this.getCenter()
            const slope = (lp.y - center.y) / (lp.x - center.x)
            const halfW = FlowNode.#sizeX/2
            const halfH = FlowNode.#sizeY/2

            if( slope * halfW >= -halfH && 
                slope * halfW <= halfH
            ) {
                const sideOfRect = (lp.x > center.x ? 1 : -1)
                hitX = center.x + sideOfRect * halfW
                hitY = center.y + sideOfRect * slope * halfW
            } else if ( 
                halfH / slope >= -halfW && 
                halfH / slope <= halfW
            ) {
                const sideOfRect = (lp.y > center.y ? 1 : -1)
                hitY = center.y + sideOfRect * halfH
                hitX = center.x + sideOfRect * halfH / slope
            }
            return { x: hitX, y: hitY }
            
        }
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
            this.className, 
            this.x + FlowNode.#textPadding,
            this.y + FlowNode.#textPadding,
            FlowNode.#sizeX - FlowNode.#textPadding * 2,
            FlowNode.#sizeY - FlowNode.#textPadding * 2,
        )

        if (this.classUnit.trim() !== '') {
            textAlign(CENTER, TOP)
            text(
                this.classUnit + " units",
                this.x + FlowNode.#textPadding,
                this.y + FlowNode.#tabSizeY + FlowNode.#textPadding,
                FlowNode.#sizeX - FlowNode.#textPadding * 2,
                FlowNode.#sizeY - FlowNode.#tabSizeY - FlowNode.#textPadding,
            )
            }
        
        if (this.classCode.trim() !== '') {
            textAlign(CENTER, CENTER)
            text(    
                this.classCode,
                this.x + FlowNode.#textPadding,
                this.y + FlowNode.#tabSizeY + FlowNode.#textPadding,
                FlowNode.#sizeX - FlowNode.#textPadding * 2,
                FlowNode.#sizeY - FlowNode.#tabSizeY - FlowNode.#textPadding,
            )     
        }

       
       if (this.className.trim() !== ''){
            textAlign(RIGHT, BOTTOM)
            text (
                "+",
                this.x + FlowNode.#textPadding,
                this.y + FlowNode.#tabSizeY + FlowNode.#textPadding,
                FlowNode.#sizeX - FlowNode.#textPadding * 2,
                FlowNode.#sizeY - FlowNode.#tabSizeY - FlowNode.#textPadding,
        
            )
        }

     
    
        
    }
}

// Helper function to perform a P5 action without
// altering the draw state permenantly
function tempDrawState(action) {
    push()
    action()
    pop()
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
        this.reset()

        // TEST NODES
        // TODO: remove from final build of website
        let testNodeColors = ["#800000", "#EE82EE", "#00FFFF", "#008000", "#FFA500"]
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

    realizeNodeModifications() {
        if (this.#curNode == null)
            throw "No node selected!"
        this.#curNode.className = document.getElementById("c-name-modify").value
        this.#curNode.classUnit = document.getElementById("c-units-modify").value
        this.#curNode.classCode = document.getElementById("c-major-modify").value
        this.#curNode.tabColor = document.getElementById("c-color-modify").value
        this.#curNode.prereqs = document.getElementById("c-prereq-modify").value.split(',')
    }

    toJson() {
        return JSON.stringify(this.#nodes)
    }

    fromJson(json) {
        this.reset();
        const records = JSON.parse(json)
        for (let nodeRecord of records) {
            let newNode = new FlowNode(nodeRecord.x, nodeRecord.y)
            if (nodeRecord.className != undefined)
                newNode.className = nodeRecord.className
            if (nodeRecord.classCode != undefined)
                newNode.classCode = nodeRecord.classCode
            if (nodeRecord.tabColor != undefined)
                newNode.tabColor = nodeRecord.tabColor
            if (nodeRecord.prereqs == undefined)
                newNode.prereqs = []
            else
                newNode.prereqs = nodeRecord.prereqs
            this.addNode(newNode)
        }
    }

    reset() {
        this.#nodes = []
    }

    findNodeByClassCode(code) {
        if(code == '')
            return undefined
        return this.#nodes.find(node => {return node.classCode == code})
    }

    // Draws an arrow, starting at p1 and pointing to p2
    drawArrow(p1, p2, color) {
        
        strokeWeight(4)

        // Dropshadow Effect
        tempDrawState(() => {
            stroke('black')
            fill('black')
            translate(3, 3)

            // Draw arrow body
            line(p1.x, p1.y, p2.x, p2.y)

            // Draw the arrow head
            tempDrawState(() => {
                translate(p2.x, p2.y)
                rotate(Math.atan2(p2.y - p1.y, p2.x - p1.x))
                triangle(
                    0, 0,
                    -20, -10,
                    -20, 10
                )
            })

        })
        
        stroke(color)
        fill(color)
        
        // Draw arrow body
        line(p1.x, p1.y, p2.x, p2.y)

        // Draw arrow head
        tempDrawState(() => {
            translate(p2.x, p2.y)
            rotate(Math.atan2(p2.y - p1.y, p2.x - p1.x))
            triangle(
                0, 0,
                -20, -10,
                -20, 10
            )
        })
        
    }

    /**
     * ======= P5 Renderer Hook =======
     * This function is invoked when P5 begins rendering.
     * The canvas should be created here.
     */
    setup() {

        let canvasRegion = document.getElementById("canvas-region").getBoundingClientRect()
        // TODO: remove these magic number offsets in the Y coord
        this.#canvas = createCanvas(windowWidth - canvasRegion.left, windowHeight - canvasRegion.top - 65);
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
        // TODO: remove these magic number offsets in the Y coord
        resizeCanvas(windowWidth - canvasRegion.left, windowHeight - canvasRegion.top - 65);
        
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

        // Draw prereq indicators
        for (let node of this.#nodes) {
            for(let prereq of node.prereqs) {
                const found = this.findNodeByClassCode(prereq)
                if(found != undefined) {
                    this.drawArrow(node.getCenter(), found.getIntersection(node.getCenter()), node.tabColor)
                }
            }
        }
    
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

            if(this.#curPopup != null) {

                // TODO: remove these magic number offsets in the Y coord
                let dim = this.#curPopup.getBoundingClientRect()
                if(
                    mouseX <= dim.left ||
                    mouseY <= dim.top - 108 ||
                    mouseX >= dim.left + dim.width ||
                    mouseY >= dim.top - 108 + dim.height
                ) {
                    this.hideLastPopup()
                }

            } else {
                this.#fadeForeground = false
            }
    
        } else if (this.#currently_dragged == null) {

            for (let node of this.#nodes) {
                if (node.isInTabVolume(mouseX, mouseY)) {
                    this.#drag_offx = mouseX - node.x
                    this.#drag_offy = mouseY - node.y
                    this.#currently_dragged = node
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

                    document.getElementById("c-name-modify").value = node.className
                    document.getElementById("c-units-modify").value = node.classUnit
                    document.getElementById("c-major-modify").value = node.classCode
                    document.getElementById("c-color-modify").value = node.tabColor
                    document.getElementById("c-prereq-modify").value = node.prereqs.join(',')

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

