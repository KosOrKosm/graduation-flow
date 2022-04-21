/**
 * @ Author: Jacob Fano
 * @ Create Time: 2022-04-12 18:47:54
 * @ Modified by: Jacob Fano
 * @ Modified time: 2022-04-21 12:23:06
 */

const scrollbar = document.getElementById('preview-scroll')
const anchor = document.getElementById('preview-anchor')
const container = document.getElementById('mini-canvas')
let scrolling = false
let scrollPivotMouseY = 0, scrollPivotAnchorY = 0

class PreviewCanvas extends Canvas {

    nodes = []
    #curOffsetY = 0
    #lastMouseY = 0

    constructor() {
        super()
    }

    setup(p5) {
        super.setup(p5)
        this._canvas.mouseWheel(this.mouseWheelListener.bind(this))
    }

    scrollY(dY) {
        
        this.#curOffsetY += dY

        // Bounds on Y offset
        if (this.#curOffsetY > 0) {
            this.#curOffsetY = 0
        }
    }

    jumpToY(y) {

        this.#curOffsetY = y

        // Bounds on Y offset
        if (this.#curOffsetY > 0) {
            this.#curOffsetY = 0
        }
    }

    draw(p5) {
        p5.background('white')

        tempDrawState(p5, () => {
            // Offset the canvas to perform the scrolling effect
            p5.translate(0, this.#curOffsetY)
            this.nodes.forEach(node => node.draw(p5))
        })
    }
    
    mousePressed(p5) {
        this.#lastMouseY = p5.mouseY
    }

    mouseDragged(p5) {

        if (scrolling)
            return

        const container = document.getElementById("mini-canvas")
        const bounds = container.getBoundingClientRect()
        if (
            p5.mouseX > 0 && 
            p5.mouseX < bounds.width && 
            p5.mouseY > 0 && 
            p5.mouseY < bounds.height
        ) {
            const mouseYDiff = p5.mouseY - this.#lastMouseY
            this.scrollY(mouseYDiff)
            this.#lastMouseY = p5.mouseY

        }
    }

    mouseReleased(p5) {
        scrolling = false
    }

    mouseWheelListener(event) {
        this.scrollY(-event.deltaY / 8)
    }

}

Object.assign(PreviewCanvas.prototype, NodesList) // Node List functionality mixin
const previewCanvas = new PreviewCanvas()
Canvas.injectInstance(previewCanvas, "mini-canvas", "mini-canvas")

// TEST NODES
// TODO: remove from final build of website
let testNodeColors2 = ["#800000", "#EE82EE", "#00FFFF", "#008000", "#FFA500"]
for(let i = 0; i < 10; ++i) {
    let node = new FlowNode(0, i * 100)
    node.tabColor = testNodeColors2[i % testNodeColors2.length]
    previewCanvas.addNode(node)
}


// HTML Event Listeners associated with PreviewCanvas

// TODO: make this height dynamic based on then number of nodes in the preview canvas
const contentHeight = container.offsetHeight * 3
anchor.style.height = Math.floor(container.offsetHeight / contentHeight * container.offsetHeight) + 'px'

scrollbar.addEventListener('mousedown', (ev) => {
    if(ev.target.nodeName == 'DIV') {
        // clicked a position inside the scrollwheel, jump to that position
        var offsetY = ev.clientY - container.offsetTop - container.offsetHeight / 2
        var newAnchorY = offsetY - anchor.offsetHeight / 2

        if (newAnchorY < 0) {
            newAnchorY = 0
        } else if (newAnchorY + anchor.offsetHeight > container.offsetHeight) {
            newAnchorY = container.offsetHeight - anchor.offsetHeight
        }
        
        anchor.style.top = newAnchorY + 'px'
        previewCanvas.jumpToY(-offsetY)
        
    } else if(ev.target.nodeName == 'SPAN') {
        // user is dragging the anchor, prepare to scroll
        scrolling = true
        scrollPivotMouseY = ev.clientY
        scrollPivotAnchorY = anchor.offsetTop
    }
})
scrollbar.addEventListener('mouseup', (ev) => {
    scrolling = false
    scrollPivotMouseY = ev.clientY
    scrollPivotAnchorY = anchor.offsetTop
})
scrollbar.addEventListener('mousemove', (ev) => {
    if(!scrolling)
        return
    
    var offsetY = ev.clientY - scrollPivotMouseY
    var newAnchorY = scrollPivotAnchorY + offsetY

    if (newAnchorY < 0) {
        newAnchorY = 0
    } else if (newAnchorY + anchor.offsetHeight > container.offsetHeight) {
        newAnchorY = container.offsetHeight - anchor.offsetHeight
    }

    anchor.style.top = newAnchorY + 'px'
    previewCanvas.jumpToY(-offsetY)

})

// Update predictions as query input changes
document.getElementById('c-query-import').addEventListener('input', (event) => {

    //  TODO
    // query DB for nodes to preview
    // display nodes retrieved on canvas

})

// BUGFIX: force a window resize whenever the PreviewCanvas is display
//         otherwise the PreviewCanvas will be size 0 until a window resize
//         occurs while the PreviewCanvas is visible
document.getElementById('btn-add').addEventListener('click', 
    (event) => previewCanvas.windowResized(Canvas.getRegionP5("mini-canvas")))
