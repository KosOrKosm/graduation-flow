/**
 * @ Author: Jacob Fano
 * @ Create Time: 2022-04-12 20:52:52
 * @ Modified by: Jacob Fano
 * @ Modified time: 2022-04-14 13:00:26
 */

class PopupManager {

    #popups = []

    popupVisible() {
        return this.#popups.length > 0
    }

    getCurPopupDim() {
        return this.#popups[0].getBoundingClientRect()
    }

    // Hides the last popup the canvas is aware of being displayed
    hideLastPopup() {

        const popup = this.#popups[0]
        this.#popups.pop()

        if(popup == undefined)
            return

        popup.style.display="none"
        //mainCanvas.setFade(false)

        const overlay = document.getElementById(popup.id + "-over")
        if (overlay != undefined)
            overlay.style.display="none"
        
    }

    // Shows a given popup
    showPopup(popupName) {
        
        let popup = document.getElementById(popupName)
        popup.style.display="block"
        //mainCanvas.setFade(true)
        this.#popups.push(popup)

        const overlay = document.getElementById(popupName + "-over")
        if (overlay != undefined)
            overlay.style.display="block"
    }

}

export const popupManager = new PopupManager()
