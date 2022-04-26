/**
 * @ Author: Jacob Fano
 * @ Create Time: 2022-04-12 18:47:54
 * @ Modified by: Jacob Fano
 * @ Modified time: 2022-04-26 15:11:05
 */

const scrollbar = document.getElementById('preview-scroll')
const anchor = document.getElementById('preview-anchor')
const container = document.getElementById('mini-canvas')

class PreviewCanvas extends Canvas {

    nodes = []
    #scroller = new ScrollbarLogic(scrollbar, anchor)
    #lastMouseY = 0

    static #rowGap = 25

    constructor() {
        super()
    }

    _setup(p5) {
        super._setup(p5)
        this._canvas.mouseWheel(this._mouseWheelListener.bind(this))
    }

    windowResized(p5) {
        super.windowResized(p5)
        this.#scroller.rescale(container.offsetHeight, this.getContentHeight(), container.offsetTop)
    }

    #getNodesPerRow() {
        const containerSpace = container.offsetWidth - scrollbar.offsetWidth
        return Math.floor(containerSpace / (FlowNode.sizeX + PreviewCanvas.#rowGap))
    }

    getContentHeight() {
        return Math.ceil(this.nodes.length / this.#getNodesPerRow()) * 
            (FlowNode.sizeY + PreviewCanvas.#rowGap) + PreviewCanvas.#rowGap
    }

    draw(p5) {
        p5.background('white')

        const containerSpace = container.offsetWidth - scrollbar.offsetWidth
        const maxNodesPerRow = this.#getNodesPerRow()
        const freeSpace = (containerSpace - FlowNode.sizeX * maxNodesPerRow - PreviewCanvas.#rowGap)

        tempDrawState(p5, () => {
            // Offset the canvas to perform the scrolling effect
            p5.translate(0, -this.#scroller.getCurPos())
            for (let i = 0; i < this.nodes.length; i++) {
                tempDrawState(p5, () => {
                    p5.translate(
                        freeSpace / 2 + (i % maxNodesPerRow) * (FlowNode.sizeX + PreviewCanvas.#rowGap),
                        freeSpace / 2 + Math.floor(i / maxNodesPerRow) * (FlowNode.sizeY + PreviewCanvas.#rowGap)
                    )
                    this.nodes[i].x = 0
                    this.nodes[i].y = 0
                    this.nodes[i].draw(p5)
                })
            }
        })
    }

    // MOUSE DOWN EVENT
    _mousePressed(p5) {

        if (this.#scroller.isScrolling())
            return

        this.#lastMouseY = p5.mouseY
        
    }

    // MOUSE DRAG EVENT
    _mouseDragged(p5) {

        if (this.#scroller.isScrolling())
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
            this.#scroller.setAnchorPos(this.#scroller.getCurPos()+mouseYDiff)
            this.#lastMouseY = p5.mouseY

        }
    }

    // MOUSE UP EVENT
    _mouseReleased(p5) {

        /*
        this.nodes.forEach((node) => {
            node.isInVolume(p5.mouseX, p5.mouseY)
            mainCanvas.addNode()
        })
        */

    }

    _mouseWheelListener(event) {
        this.#scroller.setAnchorPos(this.#scroller.getCurPos()+event.deltaY / 8)
    }

}

Object.assign(PreviewCanvas.prototype, NodesList) // Node List functionality mixin
const previewCanvas = new PreviewCanvas()
Canvas.injectInstance(previewCanvas, "mini-canvas", "mini-canvas")

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
    
    doRequest('GET', '/query').then(response => {
        previewCanvas.fromJson(response)
        previewCanvas.windowResized(Canvas.getRegionP5("mini-canvas"))
    }).catch(err => {
        console.log('unable to query database: ' + err)
    })
        
})
