/**
 * @ Author: Jacob Fano
 * @ Create Time: 2022-04-12 18:47:54
 * @ Modified by: Jacob Fano
 * @ Modified time: 2022-04-12 21:10:29
 */

 import { Canvas } from "./generic-canvas.js"
 
class PreviewCanvas extends Canvas {

    constructor() {
        super()
    }

    draw(p5) {
        p5.background('red')
        p5.fill('black')
        p5.square(
            p5.mouseX,
            p5.mouseY,
            100
        )
    }
    
    mousePressed(p5) {

    }

    mouseDragged(p5) {
        
    }

    mouseReleased(p5) {

    }

}

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
document.getElementById('btn-add').addEventListener('click', 
    (event) => previewCanvas.windowResized(Canvas.getRegionP5("mini-canvas")))

