/**
 * @ Author: Jacob Fano
 * @ Create Time: 2022-04-07 13:08:14
 * @ Modified by: Jacob Fano
 * @ Modified time: 2022-05-12 13:41:41
 */


/**
 *  Describes a single node in the flowchart
 *  Contains all the data describing that node, as well as
 *  functions for rendering + interacting with the node.
 */
 class FlowNode {

    // PUBLIC
    x = 0
    y = 0
 
    classPrefixNumber = ""
    className = ""
    classUnit = ""
    classMajor = ""
    classDescription = ""
    tabColor = "white"
    prereqs = []
 
    static sizeX = 100
    static sizeY = 70
 
    // PRIVATE
    static #tabSizeY = 20
    static #textPadding = 3
 
    static font = undefined
 
    constructor(x, y) {
 
       if (x != undefined)
          this.x = document.getElementById('btn-create').offsetLeft
       if (y != undefined)
          this.y = document.getElementById('btn-create').offsetTop - 25
 
    }
 
    getCenter() {
       const x = FlowNode.sizeX / 2 + this.x
       const y = FlowNode.sizeY / 2 + this.y
       return {
          x,
          y
       }
    }
 
    // Calculates where a line segment starting at lp and ending
    // at the center of the node would intersect the node's rectangle
    getIntersection(lp) {
       if (this.isInVolume(lp.x, lp.y))
          return undefined
       else {
 
          let hitX = 0,
             hitY = 0
          const center = this.getCenter()
          const slope = (lp.y - center.y) / (lp.x - center.x)
          const halfW = FlowNode.sizeX / 2
          const halfH = FlowNode.sizeY / 2
 
          if (slope * halfW >= -halfH &&
             slope * halfW <= halfH
          ) {
             const sideOfRect = (lp.x > center.x ? 1 : -1)
             hitX = center.x + sideOfRect * halfW
             hitY = center.y + sideOfRect * slope * halfW
          } else if (
             halfH / slope >= -halfW &&
             halfH / slope <= halfW
          ) {
             const sideOfRect = (lp.y > center.y ? 1 : -1)
             hitY = center.y + sideOfRect * halfH
             hitX = center.x + sideOfRect * halfH / slope
          }
          return {
             x: hitX,
             y: hitY
          }
 
       }
    }
 
    static fromJson(json) {
       return this.fromSimilarRecord(JSON.parse(json))
    }
 
    static fromSimilarRecord(record) {
       let ret = new FlowNode(0, 0)
       const props = Object.keys(record)
       for (const prop of props) {
          if (FlowNode.prototype.hasOwnProperty.call(ret, prop)) {
             ret[prop] = record[prop]
          }
       }
       return ret
    }
 
    isInVolume(_x, _y) {
       return this.x <= _x &&
          this.y <= _y &&
          this.x + FlowNode.sizeX >= _x &&
          this.y + FlowNode.sizeY >= _y
    }
 
    isInTabVolume(_x, _y) {
       return this.x <= _x &&
          this.y <= _y &&
          this.x + FlowNode.sizeX >= _x &&
          this.y + FlowNode.#tabSizeY >= _y
    }
 
    lockToBounds(x, y, width, height) {
 
       if (this.x < x)
          this.x = x
       if (this.y < y)
          this.y = y
       if (this.x + FlowNode.sizeX > x + width)
          this.x = width - FlowNode.sizeX
       if (this.y + FlowNode.sizeY > y + height)
          this.y = height - FlowNode.sizeY
    }
 
    draw(p) {
       p.stroke('rgb(0,0,0)')
       p.strokeWeight(2)
       p.fill('white')
       p.rect(this.x, this.y, FlowNode.sizeX, FlowNode.sizeY, 5)
       p.fill(this.tabColor)
       p.rect(this.x, this.y, FlowNode.sizeX, FlowNode.#tabSizeY, 5)
 
       p.strokeWeight(0)
 
       //draw Prefix Number on Node
       p.textFont(FlowNode.font, 12)
       p.textAlign(p.CENTER, p.TOP)
       p.fill('black')
       p.text(
          this.classPrefixNumber.toUpperCase(),
          this.x + FlowNode.#textPadding,
          this.y + FlowNode.#textPadding,
          FlowNode.sizeX - FlowNode.#textPadding * 2,
          FlowNode.sizeY - FlowNode.#textPadding * 2,
       )
 
       p.textAlign(p.CENTER, p.CENTER)
       p.textWrap(p.WORD)
       p.text(
          (this.className.replace('-', ' ')).slice(0, 35),
          this.x,
          this.y + FlowNode.#tabSizeY + FlowNode.#textPadding,
          FlowNode.sizeX,
          FlowNode.sizeY - FlowNode.#tabSizeY - FlowNode.#textPadding
       )
 
    }
 }