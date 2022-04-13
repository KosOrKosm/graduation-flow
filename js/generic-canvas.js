/**
 * @ Author: Jacob Fano
 * @ Create Time: 2022-04-12 19:02:12
 * @ Modified by: Jacob Fano
 * @ Modified time: 2022-04-12 19:19:24
 */

class Canvas {

    div = undefined
    #canvas = undefined

    static #instanceMap = new Map()

    setup(p5) {
        this.#canvas = p5.createCanvas(100, 100);
        this.windowResized(p5)
    }

    windowResized(p5) {
        p5.resizeCanvas(div.offsetWidth, div.offsetHeight);
        this.#canvas.style("width","100%")
        this.#canvas.style("height","100%")
    }

    static injectInstance(canvasImpl, divName) {

        if (Canvas.#instanceMap.has(divName))
            throw "A canvas is already bound to the div named " + divName

        if(!(canvasImpl instanceof Canvas))

        var sketch = (p5) => {

            const canvas = canvasImpl
            canvas.div = document.getElementById(divName)

            // Mount main canvas functions to the locations p5 expects them
            p5.setup = () => {
                canvas.setup(p5)
            }
            p5.windowResized = () => {
                canvas.windowResized(p5)
            }
            p5.draw = () => {
                canvas.draw(p5)
            }
            p5.mousePressed = () => {
                canvas.mousePressed(p5)
            }
            p5.mouseDragged = () => {
                canvas.mouseDragged(p5)
            }
            p5.mouseReleased = () => { 
                canvas.mouseReleased(p5)
            }

        }
        
        const canvasRegion = document.getElementById(divName)
        Canvas.#instanceMap.set(divName, new p5(sketch, canvasRegion))

    }

}