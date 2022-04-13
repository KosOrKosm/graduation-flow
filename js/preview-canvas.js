/**
 * @ Author: Jacob Fano
 * @ Create Time: 2022-04-12 18:47:54
 * @ Modified by: Jacob Fano
 * @ Modified time: 2022-04-12 20:35:11
 */

class PreviewCanvas extends Canvas {

    constructor() {
        super()
    }

    draw(p5) {
        p5.background('red')
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

// BUGFIX: force a window resize whenever the PreviewCanvas is display
//         otherwise the PreviewCanvas will be size 0 until a window resize
//         occurs while the PreviewCanvas is visible
document.getElementById('btn-add').addEventListener('click', 
    (event) => previewCanvas.windowResized(Canvas.getRegionP5("mini-canvas")))
