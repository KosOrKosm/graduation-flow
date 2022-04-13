/**
 * @ Author: Jacob Fano
 * @ Create Time: 2022-04-12 18:47:54
 * @ Modified by: Jacob Fano
 * @ Modified time: 2022-04-12 19:53:39
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

Canvas.injectInstance(new PreviewCanvas(), "mini-canvas", "mini-canvas")

