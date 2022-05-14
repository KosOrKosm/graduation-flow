/**
 * @ Author: Jacob Fano
 * @ Create Time: 2022-04-12 19:02:12
 * @ Modified by: Jacob Fano
 * @ Modified time: 2022-04-21 13:54:07
 */

 class Canvas {

    _canvas = undefined
    #parentDiv = undefined
 
    static #instanceMap = new Map()
 
    /**
     * ======= P5 Renderer Hook =======
     * This function is invoked when P5 begins rendering.
     * The canvas should be created here.
     */
    _setup(p5) {
       this._canvas = p5.createCanvas(100, 100)
       this._canvas.parent(this.#parentDiv)
       this.windowResized(p5)
    }
 
    /**
     * ======= P5 Renderer Hook =======
     * This function is invoked when P5 detects a change to the window's size
     * 
     * The canvas's size is briefly set to 0 to ensure it doesn't impact the calculation
     * of its parent's width and height
     */
    windowResized(p5) {
       p5.resizeCanvas(0, 0)
       p5.resizeCanvas(this.#parentDiv.offsetWidth, this.#parentDiv.offsetHeight - 4)
       this._canvas.style("width", "100%")
       this._canvas.style("height", "auto")
    }
 
    setParentDiv(div) {
       this.#parentDiv = div
    }
 
    /*
     * Helper function to generate a unique p5 instance and of a canvas
     * and bind it to a given region on the page.
     * 
     * See main-canvas.js for usage.
     * 
     */
    static injectInstance(canvasImpl, canvasRegion, canvasParent) {
 
       if (Canvas.#instanceMap.has(canvasRegion))
          throw "A canvas is already bound to the div named " + canvasRegion
 
       if (!(canvasImpl instanceof Canvas))
          throw "Given object is not a canvas"
 
       // Configurator for p5
       var doConfigureP5 = (p5) => {
 
          canvasImpl.setParentDiv(document.getElementById(canvasParent))
 
          // Mount main canvas functions to the locations p5 expects them
          p5.setup = () => {
             canvasImpl._setup(p5)
          }
          p5.windowResized = () => {
             canvasImpl.windowResized(p5)
          }
          p5.draw = () => {
             canvasImpl.draw(p5)
          }
          p5.mousePressed = () => {
             canvasImpl._mousePressed(p5)
          }
          p5.mouseDragged = () => {
             canvasImpl._mouseDragged(p5)
          }
          p5.mouseReleased = () => {
             canvasImpl._mouseReleased(p5)
          }
 
       }
 
       // Save the new p5 instance to the map for future recall
       Canvas.#instanceMap.set(canvasRegion, new p5(doConfigureP5, document.getElementById(canvasRegion)))
 
    }
 
    static getRegionP5(region) {
       return Canvas.#instanceMap.get(region)
    }
 
 }