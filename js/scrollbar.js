/**
 * @ Author: Jacob Fano
 * @ Create Time: 2022-04-26 15:00:09
 * @ Modified by: Jacob Fano
 * @ Modified time: 2022-04-26 15:04:39
 */

/**
 * Class representing a custom HTML scrollbar. 
 * Defines the necessary event listeners and logic tracking to implement
 * the scrollbar's behavior.
 * 
 * Retrive the scrollbar's offset with getCurPos() to use the scrollbar in other code!
 */
 class ScrollbarLogic {

    #scrollbar = undefined
    #anchor = undefined
 
    #top = 0
    #scrollPivotMouseY = 0
    #scrollPivotAnchorY = 0
    #scrolling = false
    #containerHeight = 0
    #contentHeight = 0
    #containerYtoContentY = 1
 
    constructor(scrollbar, anchor) {
 
       this.#scrollbar = scrollbar
       this.#anchor = anchor
 
       this.#scrollbar.addEventListener('mousedown', (ev) => {
          this.#scrolling = true
          if (ev.target.nodeName == 'DIV') {
             // clicked a position inside the scrollwheel, jump to that position
             var offsetY = ev.clientY - this.#top - this.#anchor.offsetHeight / 2
 
             if (offsetY < 0) {
                offsetY = 0
             } else if (offsetY + this.#anchor.offsetHeight > this.#containerHeight) {
                offsetY = this.#containerHeight - this.#anchor.offsetHeight
             }
 
             const finalOffset = (offsetY - this.#scrollbar.offsetTop) / this.#containerYtoContentY
             this.setAnchorPos(finalOffset)
 
          } else if (ev.target.nodeName == 'SPAN') {
             // user is dragging the anchor, prepare to scroll
             this.#scrollPivotMouseY = ev.clientY
             this.#scrollPivotAnchorY = this.#anchor.offsetTop
          }
       })
       this.#scrollbar.addEventListener('mouseup', (ev) => {
          this.#scrolling = false
          this.#scrollPivotMouseY = ev.clientY
          this.#scrollPivotAnchorY = this.#anchor.offsetTop
       })
       document.addEventListener('mouseup', (ev) => {
          this.#scrolling = false
       })
       document.addEventListener('mousemove', (ev) => {
          if (!this.#scrolling)
             return
 
          var offsetY = ev.clientY - this.#scrollPivotMouseY + this.#scrollPivotAnchorY
 
          if (offsetY < 0) {
             offsetY = 0
          } else if (offsetY + this.#anchor.offsetHeight > this.#containerHeight) {
             offsetY = this.#containerHeight - this.#anchor.offsetHeight
          }
 
          const finalOffset = (offsetY - this.#scrollbar.offsetTop) / this.#containerYtoContentY
          this.setAnchorPos(finalOffset)
 
       })
    }
 
    rescale(maxHeight, targetHeight, top) {
       this.#containerHeight = maxHeight
       this.#contentHeight = targetHeight
       this.#top = top
       if (targetHeight <= maxHeight) {
          this.#scrollbar.style.setProperty('display', 'none')
       } else {
          this.#scrollbar.style.setProperty('display', 'block')
       }
       this.#containerYtoContentY = maxHeight / targetHeight
       this.#anchor.style.height = Math.floor(this.#containerYtoContentY * maxHeight) + 'px'
       this.#anchor.style.top = '0px'
    }
 
    setScrollingState(bool) {
       this.#scrolling = bool
    }
 
    isScrolling() {
       return this.#scrolling
    }
 
    setAnchorPos(yOffset) {
       // Bounds on Y offset
       if (yOffset < 0 || this.#contentHeight <= this.#containerHeight) {
          yOffset = 0
       } else if (yOffset > this.#contentHeight - this.#containerHeight) {
          yOffset = this.#contentHeight - this.#containerHeight
       }
       this.#anchor.style.top = (yOffset * this.#containerYtoContentY) + 'px'
    }
 
    getCurPos() {
       return this.#anchor.offsetTop / this.#containerYtoContentY
    }
 
 }