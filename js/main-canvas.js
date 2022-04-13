/**
 * @ Author: Jacob Fano
 * @ Create Time: 2022-03-11 14:42:55
 * @ Modified by: Jacob Fano
 * @ Modified time: 2022-04-12 16:13:24
 */

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
        this.#curNode.classCode = document.getElementById("c-major-modify").value
        this.#curNode.tabColor = document.getElementById("c-color-modify").value
        this.#curNode.prereqs = document.getElementById("c-prereq-modify").value.split(',')
    }

    toJson() {
        return JSON.stringify(this.#nodes)
    }

    fromJson(json) {
        this.reset()
        JSON.parse(json).forEach((record) => this.addNode(FlowNode.fromSimilarRecord(record)))
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
    drawArrow(p5, point1, point2, color) {
        
        p5.strokeWeight(4)

        // Dropshadow Effect
        tempDrawState(p5, () => {
            p5.stroke('black')
            p5.fill('black')
            p5.translate(3, 3)

            // Draw arrow body
            p5.line(point1.x, point1.y, point2.x, point2.y)

            // Draw the arrow head
            tempDrawState(p5, () => {
                p5.translate(point2.x, point2.y)
                p5.rotate(Math.atan2(point2.y - point1.y, point2.x - point1.x))
                p5.triangle(
                    0, 0,
                    -20, -10,
                    -20, 10
                )
            })

        })
        
        p5.stroke(color)
        p5.fill(color)
        
        // Draw arrow body
        p5.line(point1.x, point1.y, point2.x, point2.y)

        // Draw arrow head
        tempDrawState(p5, () => {
            p5.translate(point2.x, point2.y)
            p5.rotate(Math.atan2(point2.y - point1.y, point2.x - point1.x))
            p5.triangle(
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
    setup(p5) {
        this.#canvas = p5.createCanvas(100, 100);
        this.windowResized(p5)
    }
    
    /**
     * ======= P5 Renderer Hook =======
     * This function is invoked whenever the browser window is resized.
     * The canvas should be resized to fit the new window here.
     */
    windowResized(p5) {
        
        const canvasRegion = document.getElementById("canvas-region").getBoundingClientRect()
        // TODO: remove these magic number offsets in the Y coord
        p5.resizeCanvas(p5.windowWidth - canvasRegion.left, p5.windowHeight - canvasRegion.top - 65);
        
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
    draw(p5) {
    
        p5.clear()

        // Draw prereq indicators
        for (let node of this.#nodes) {
            for(let prereq of node.prereqs) {
                const found = this.findNodeByClassCode(prereq)
                if(found != undefined) {
                    this.drawArrow(p5, node.getCenter(), found.getIntersection(node.getCenter()), node.tabColor)
                }
            }
        }
    
        for (let node of this.#nodes) {
            node.draw(p5)
        }
    
        if (this.#fadeForeground) {
    
            if(this.#fadeForegroundAlpha < this.#fadeForegroundAlphaTarget)
                this.#fadeForegroundAlpha += this.#fadeForegroundAlphaTarget / 7
    
            p5.fill(`rgba(0,0,0,${this.#fadeForegroundAlpha})`);
            p5.rect(-2, -2, p5.windowWidth, p5.windowHeight)
    
        }
    
    }
    
    /**
     * ======= P5 Renderer Hook =======
     * This function is invoked whenever the mouse is:
     *      Pressed (ie. starting to click) 
     * anywhere in the browser
     */
    mousePressed(p5) {
    
        if (this.#fadeForeground) {

            if(this.#curPopup != null) {

                // TODO: remove these magic number offsets in the Y coord
                let dim = this.#curPopup.getBoundingClientRect()
                if(
                    p5.mouseX <= dim.left ||
                    p5.mouseY <= dim.top - 108 ||
                    p5.mouseX >= dim.left + dim.width ||
                    p5.mouseY >= dim.top - 108 + dim.height
                ) {
                    this.hideLastPopup()
                }

            } else {
                this.#fadeForeground = false
            }
    
        } else if (this.#currently_dragged == null) {

            for (let node of this.#nodes) {
                if (node.isInTabVolume(p5.mouseX, p5.mouseY)) {
                    this.#drag_offx = p5.mouseX - node.x
                    this.#drag_offy = p5.mouseY - node.y
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
    mouseDragged(p5) {
    
        this.#dragging = true
    
        if (this.#currently_dragged != null) {
            this.#currently_dragged.x = (p5.mouseX - this.#drag_offx)
            this.#currently_dragged.y = (p5.mouseY - this.#drag_offy)
        }
    
    }
    
    /**
     * ======= P5 Renderer Hook =======
     * This function is invoked whenever the mouse is:
     *      Released (ie. ending a click or drag) 
     * anywhere in the browser
     */
    mouseReleased(p5) {
    
        if (this.#fadeForeground) {
    
        } else if (!this.#dragging) {
    
            for (let node of this.#nodes) {
                if (node.isInVolume(p5.mouseX, p5.mouseY)) {

                    document.getElementById("c-name-modify").value = node.className
                    document.getElementById("c-major-modify").value = node.classCode
                    document.getElementById("c-color-modify").value = node.tabColor
                    document.getElementById("c-prereq-modify").value = node.prereqs.join(',')

                    this.showPopup("modify-node-form-over")
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

var mainCanvasSketch = function(p5) {
    mainCanvas = new MainCanvas()
    
    // Mount main canvas functions to the locations p5 expects them
    p5.setup = () => {
        mainCanvas.setup(p5)
    }
    p5.draw = () => {
        mainCanvas.draw(p5)
    }
    p5.windowResized = () => {
        mainCanvas.windowResized(p5)
    }
    p5.mousePressed = () => {
        mainCanvas.mousePressed(p5)
    }
    p5.mouseDragged = () => {
        mainCanvas.mouseDragged(p5)
    }
    p5.mouseReleased = () => { 
        mainCanvas.mouseReleased(p5)
    }

}

const canvasRegion = document.getElementById("canvas-region")
new p5(mainCanvasSketch, canvasRegion)
