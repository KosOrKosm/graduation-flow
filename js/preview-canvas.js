/**
 * @ Author: Jacob Fano
 * @ Create Time: 2022-04-12 18:47:54
 * @ Modified by: Jacob Fano
 * @ Modified time: 2022-05-12 13:47:42
 */

 const scrollbar = document.getElementById('preview-scroll')
 const anchor = document.getElementById('preview-anchor')
 const container = document.getElementById('mini-canvas')
 
 let startTime
 
 class PreviewCanvas extends Canvas {
 
    nodes = []
    queryString = ''
 
    #filteredNodes = []
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
 
    updateFilter(filterString) {
 
       this.#filteredNodes = this.nodes.filter((node) => {
          if (filterString === '' || filterString == undefined || filterString == null)
             return true
          return node.className.toLowerCase().startsWith(filterString.toLowerCase()) ||
             node.classPrefixNumber.toLowerCase().startsWith(filterString.toLowerCase())
       })
 
    }
 
    draw(p5) {
       p5.background('white')
 
       const containerSpace = container.offsetWidth - scrollbar.offsetWidth
       const maxNodesPerRow = this.#getNodesPerRow()
       const freeSpace = (containerSpace - FlowNode.sizeX * maxNodesPerRow - PreviewCanvas.#rowGap)
 
       tempDrawState(p5, () => {
          // Offset the canvas to perform the scrolling effect
          p5.translate(0, -this.#scroller.getCurPos())
          for (let i = 0; i < this.#filteredNodes.length; i++) {
             tempDrawState(p5, () => {
                this.#filteredNodes[i].x = freeSpace / 2 + (i % maxNodesPerRow) * (FlowNode.sizeX + PreviewCanvas.#rowGap)
                this.#filteredNodes[i].y = freeSpace / 2 + Math.floor(i / maxNodesPerRow) * (FlowNode.sizeY + PreviewCanvas.#rowGap)
                this.#filteredNodes[i].draw(p5)
             })
          }
       })
    }
 
    // MOUSE DOWN EVENT
    _mousePressed(p5) {
 
       if (this.#scroller.isScrolling())
          return
       startTime = new Date();
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
          this.#scroller.setAnchorPos(this.#scroller.getCurPos() + mouseYDiff)
          this.#lastMouseY = p5.mouseY
 
       }
    }
 
    // MOUSE UP EVENT
    _mouseReleased(p5) {
       let currentTime = new Date();
       let elapsedTime = currentTime - startTime;
       if (elapsedTime < 200) {
          p5.mouseY = p5.mouseY + this.#scroller.getCurPos();
          this.#filteredNodes.forEach(element => {
             if (element.isInVolume(p5.mouseX, p5.mouseY)) {
                let clickedNode = FlowNode.fromSimilarRecord(element);
                clickedNode.y -= this.#scroller.getCurPos();
                clickedNode.lockToBounds(0, 0, p5.width, p5.height);
                mainCanvas.addNode(clickedNode);
                popupManager.hideLastPopup();
             }
          });
       }
    }
 
    _mouseWheelListener(event) {
       this.#scroller.setAnchorPos(this.#scroller.getCurPos() + event.deltaY / 8)
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
    previewCanvas.updateFilter(event.target.value)
 
 })
 
 // BUGFIX: force a window resize whenever the PreviewCanvas is display
 //         otherwise the PreviewCanvas will be size 0 until a window resize
 //         occurs while the PreviewCanvas is visible
 document.getElementById('btn-import').addEventListener('click', (event) => {
 
    doRequest('GET', '/query').then(response => {
       previewCanvas.fromJson(response)
       previewCanvas.updateFilter('')
       previewCanvas.windowResized(Canvas.getRegionP5("mini-canvas"))
    }).catch(err => {
       console.log('unable to query database: ' + err)
    })
 
 })