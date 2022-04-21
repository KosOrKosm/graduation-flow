/**
 * @ Author: Jacob Fano
 * @ Create Time: 2022-04-12 18:47:54
 * @ Modified by: Jacob Fano
 * @ Modified time: 2022-04-21 13:15:21
 */

const scrollbar = document.getElementById('preview-scroll')
const anchor = document.getElementById('preview-anchor')
const container = document.getElementById('mini-canvas')
let scrolling = false
let scrollPivotMouseY = 0, scrollPivotAnchorY = 0
var containerYtoContentY

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

    getContentHeight() {
        let maxCanvasY = 0
        this.nodes.forEach((node) => {
            if (node.y > maxCanvasY)
                maxCanvasY = node.y + FlowNode.sizeY + 4
        })
        return maxCanvasY
    }

    jumpToY(y) {

        this.#curOffsetY = y

        const contentHeight = this.getContentHeight() 
        // Bounds on Y offset
        if (this.#curOffsetY < 0) {
            this.#curOffsetY = 0
        } else if (this.#curOffsetY > contentHeight - container.offsetHeight) {
            this.#curOffsetY = contentHeight - container.offsetHeight
        }
        anchor.style.top = (this.#curOffsetY * containerYtoContentY) + 'px'
    }

    scrollY(dY) {
        this.jumpToY(this.#curOffsetY - dY)
    }

    arrangeNodes() {
        const rowGap = 25
        const containerSpace = container.offsetWidth - scrollbar.offsetWidth
        const maxNodesPerRow = Math.floor(containerSpace / (FlowNode.sizeX + rowGap))
        const freeSpace = (containerSpace - FlowNode.sizeX * maxNodesPerRow - rowGap)
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].x = freeSpace / 2 + (i % maxNodesPerRow) * (FlowNode.sizeX + rowGap)
            this.nodes[i].y = freeSpace / 2 + Math.floor(i / maxNodesPerRow) * (FlowNode.sizeY + rowGap)
        }
    }

    draw(p5) {
        p5.background('white')

        tempDrawState(p5, () => {
            // Offset the canvas to perform the scrolling effect
            p5.translate(0, -this.#curOffsetY)
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
            const mouseYDiff = this.#lastMouseY - p5.mouseY
            this.scrollY(-mouseYDiff)
            this.#lastMouseY = p5.mouseY

        }
    }

    mouseReleased(p5) {
        scrolling = false
    }

    mouseWheelListener(event) {
        this.scrollY(event.deltaY / 8)
    }

}

Object.assign(PreviewCanvas.prototype, NodesList) // Node List functionality mixin
const previewCanvas = new PreviewCanvas()
Canvas.injectInstance(previewCanvas, "mini-canvas", "mini-canvas")

// TEST NODES
// TODO: remove from final build of website
let testNodeColors2 = ["#800000", "#EE82EE", "#00FFFF", "#008000", "#FFA500"]
for(let i = 0; i < 10; ++i) {
    let node = new FlowNode(0, 0)
    node.tabColor = testNodeColors2[i % testNodeColors2.length]
    previewCanvas.addNode(node)
}


// HTML Event Listeners associated with PreviewCanvas

scrollbar.addEventListener('mousedown', (ev) => {
    if(ev.target.nodeName == 'DIV') {
        // clicked a position inside the scrollwheel, jump to that position
        var offsetY = ev.clientY - container.offsetTop - container.offsetHeight / 2 - anchor.offsetHeight / 2

        if (offsetY < 0) {
            offsetY = 0
        } else if (offsetY + anchor.offsetHeight > container.offsetHeight) {
            offsetY = container.offsetHeight - anchor.offsetHeight
        }
        
        previewCanvas.jumpToY((offsetY - scrollbar.offsetTop) / containerYtoContentY)
        
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
    
    var offsetY = ev.clientY - scrollPivotMouseY + scrollPivotAnchorY

    if (offsetY < 0) {
        offsetY = 0
    } else if (offsetY + anchor.offsetHeight > container.offsetHeight) {
        offsetY = container.offsetHeight - anchor.offsetHeight
    }

    previewCanvas.jumpToY((offsetY - scrollbar.offsetTop) / containerYtoContentY)

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
document.getElementById('btn-add').addEventListener('click', (event) => {

        previewCanvas.windowResized(Canvas.getRegionP5("mini-canvas"))
        previewCanvas.arrangeNodes()
        containerYtoContentY = container.offsetHeight / previewCanvas.getContentHeight()
        anchor.style.height = Math.floor(containerYtoContentY * container.offsetHeight) + 'px'
        
})
