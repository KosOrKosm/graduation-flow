/**
 * @ Author: Jacob Fano
 * @ Create Time: 2022-04-14 11:05:19
 * @ Modified by: Jacob Fano
 * @ Modified time: 2022-04-21 11:34:36
 */

// Node list functionality mixin
const NodesList = {

    addNode(node) {
       this.nodes.push(node)
    },
 
    removeNode(node) {
       this.nodes = this.nodes.filter(item => item !== node)
    },
 
    toJson() {
       return JSON.stringify(this.nodes)
    },
 
    fromJson(json) {
       this.reset()
       JSON.parse(json).forEach((record) => this.addNode(FlowNode.fromSimilarRecord(record)))
    },
 
    reset() {
       this.nodes = []
    },
 
    findNodeByClassCode(code) {
       if (code == '')
          return undefined
       return this.nodes.find(node => {
          return (node.classPrefixNumber.replace(/\s+/g, '')).toUpperCase() == (code.replace(/\s+/g, '')).toUpperCase()
       })
    }
 
 }