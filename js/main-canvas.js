/**
 * @ Author: Jacob Fano
 * @ Create Time: 2022-03-11 14:42:55
 * @ Modified by: Jacob Fano
 * @ Modified time: 2022-05-12 13:47:31
 */

/**
 * This object contains all the app's runtime data
 * and P5 rendering hooks.
 */
 class MainCanvas extends Canvas {

    nodes = []
 
    // PRIVATE
    #dragging = false
    #currently_dragged = null
    #drag_offx = 0
    #drag_offy = 0
    #autosaveTimer
 
    static #defaultSaveKey = 'GRADFLOW-DATA-LOCAL'
    static autosaveKey = `${MainCanvas.#defaultSaveKey}-AUTOSAVE`
 
    _setup(p5) {
       super._setup(p5)
       FlowNode.font = p5.loadFont('css/font/robotoslab/robotoslab.ttf')
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
       // We do this before nodes so the nodes render on top the arrows
       this.nodes.forEach((dependentNode) => {
 
          dependentNode.prereqs.forEach((prereq) => {
 
             const prereqNode = this.findNodeByClassCode(prereq)
 
             if (prereqNode) {
 
                // Draw an arrow from the prereq node to the dependent noe
                drawArrow(p5,
                   prereqNode.getCenter(),
                   dependentNode.getIntersection(prereqNode.getCenter()),
                   prereqNode.tabColor
                )
 
             }
 
          })
 
       })
 
       // Draw all nodes
       this.nodes.forEach(node => node.draw(p5))
 
    }
 
    /**
     * ======= P5 Renderer Hook =======
     * This function is invoked whenever the mouse is:
     *      Pressed (ie. starting to click) 
     * anywhere in the browser
     */
    _mousePressed(p5) {
 
       if (popupManager.popupVisible()) {
 
          // TODO: remove these magic number offsets in the Y coord
          let dim = popupManager.getCurPopupDim()
          if (
             p5.mouseX <= dim.left ||
             p5.mouseY <= dim.top - 108 ||
             p5.mouseX >= dim.left + dim.width ||
             p5.mouseY >= dim.top - 108 + dim.height
          ) {
             popupManager.hideLastPopup()
          }
 
       }
 
       if (!popupManager.popupVisible() && this.#currently_dragged == null) {
 
          for (let node of this.nodes) {
             if (node.isInTabVolume(p5.mouseX, p5.mouseY)) {
                this.#drag_offx = p5.mouseX - node.x
                this.#drag_offy = p5.mouseY - node.y
                this.#currently_dragged = node
                this.#cancelPendingAutosave()
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
    _mouseDragged(p5) {
 
       this.#dragging = true
 
       if (this.#currently_dragged != null) {
          this.#currently_dragged.x = (p5.mouseX - this.#drag_offx)
          this.#currently_dragged.y = (p5.mouseY - this.#drag_offy)
          this.#currently_dragged.lockToBounds(0, 0, p5.width, p5.height)
       }
 
    }
 
    /**
     * ======= P5 Renderer Hook =======
     * This function is invoked whenever the mouse is:
     *      Released (ie. ending a click or drag) 
     * anywhere in the browser
     */
    _mouseReleased(p5) {
 
       if (this.#dragging) {
 
          this.scheduleAutosave()
 
       } else if (!popupManager.popupVisible()) {
 
          for (let node of this.nodes) {
             if (node.isInVolume(p5.mouseX, p5.mouseY)) {
 
                document.getElementById("c-prefixnum-modify").value = node.classPrefixNumber
                document.getElementById("c-name-modify").value = node.className
                document.getElementById("c-unit-modify").value = node.classUnit
                document.getElementById("c-major-modify").value = node.classMajor
                document.getElementById("c-description-modify").value = node.classDescription
                document.getElementById("c-color-modify").value = node.tabColor
                document.getElementById("c-prereq-modify").value = node.prereqs.join(',')
 
                selectNode(node)
                viewNode()
                break
             }
          }
 
       }
 
       this.#dragging = false
       this.#currently_dragged = null
 
    }
 
    askToReset() {
       if (window.confirm('Are you sure you want to reset the canvas?'))
          this.reset()
          localStorage.clear()
    }
 
    #cancelPendingAutosave() {
 
       if (this.#autosaveTimer != undefined) {
          clearTimeout(this.#autosaveTimer)
          this.#autosaveTimer = undefined
       }
 
    }
 
    scheduleAutosave() {
 
       this.#cancelPendingAutosave()
       // Autosave if a second pass after a change without new changes
       this.#autosaveTimer = setTimeout(() => {
          this.saveToBrowser(MainCanvas.autosaveKey)
          this.#autosaveTimer = undefined
       }, 1000)
 
    }
 
    saveToBrowser(key) {
       const saveData = this.toJson()
       localStorage.setItem(key, saveData)
    }
 
    saveToBrowserPrompt() {
       this.saveToBrowser(prompt('What would you like to name the save?', MainCanvas.#defaultSaveKey))
    }
 
    loadFromBrowser(key) {
       const saveData = localStorage.getItem(key)
       if (saveData)
          this.fromJson(saveData)
       return saveData != undefined
    }
 
    loadFromBrowserPrompt() {
       if (!this.loadFromBrowser(prompt('What is the name of the save you would like to load?', MainCanvas.#defaultSaveKey)))
          alert("No save data found!")
    }
 
 }
 
 
 Object.assign(MainCanvas.prototype, NodesList) // Node List functionality mixin
 const mainCanvas = new MainCanvas()
 Canvas.injectInstance(mainCanvas, "canvas-container", "canvas-region")
 
 // Auto load the last canvas when the canvas page is loaded
 window.addEventListener('load', (ev) => {
    mainCanvas.loadFromBrowser(MainCanvas.autosaveKey)
 })