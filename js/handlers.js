/**
 * @ Author: Jacob Fano
 * @ Create Time: 2022-03-11 14:42:55
 * @ Modified by: Jacob Fano
 * @ Modified time: 2022-05-12 13:45:21
 */


// This file contains JS functions to be invoked by HTML buttons.
// 

function onClickSaveFile() {
    tryDownloadPrompt(mainCanvas.toJson(), 'canvas.json', 'text/plain')
 }
 
 function onClickSaveBrowser() {
    mainCanvas.saveToBrowserPrompt()
 }
 
 function onClickLoadFile() {
    tryUploadPrompt((text) => mainCanvas.fromJson(text))
 }
 
 function onClickLoadBrowser() {
    mainCanvas.loadFromBrowserPrompt()
 }
 
 function ExportPNG() {
    Canvas.getRegionP5("canvas-container").saveCanvas('myGradFlow', 'png')
 }
 
 function ExportJPEG() {
    Canvas.getRegionP5("canvas-container").saveCanvas('myGradFlow', 'jpeg')
 }
 
 function validatePreInput(id) {
    let validatePrefixNumber = document.getElementById(id).value;
    let regularExpression = /^([A-Za-z]{3,4}\s?)?[0-9]{3}([A-Za-z])?$/;
    if (regularExpression.test(validatePrefixNumber)) {
       return true;
    } else {
       return false;
    }
 }
 
 function validateUnitInput(id) {
    let validateUnitNumber = document.getElementById(id).value;
    let regularExpression = /(^[0-9]{1}[0-2]?$)|^$/;
    if (regularExpression.test(validateUnitNumber)) {
       return true;
    } else {
       return false;
    }
 }
 
 function onClickCreateCustomNode() {
    if (validatePreInput("c-prefixnum-create") == true && validateUnitInput("c-unit-create") == true) {
       // let btn = document.getElementById("btn-create-custom")
       let popup = document.getElementById("create-node-form-body")
 
       let customNode = new FlowNode(0, 300)
       customNode.classPrefixNumber = (document.getElementById("c-prefixnum-create").value).toUpperCase()
       customNode.className = document.getElementById("c-name-create").value
       customNode.classUnit = document.getElementById("c-unit-create").value
       customNode.classMajor = document.getElementById("c-major-create").value
       customNode.classDescription = document.getElementById("c-description-create").value
       customNode.tabColor = document.getElementById("c-color-create").value
       customNode.prereqs = (document.getElementById("c-prereq-create").value.toUpperCase()).trim().split(/\s*,\s*/).filter(entry => /\S/.test(entry));
       mainCanvas.addNode(customNode)
       mainCanvas.scheduleAutosave()
       popupManager.hideLastPopup()
       popup.reset()
    }
 
 }
 
 function onClickCreate() {
    // let btn = document.getElementById("btn-create")
    // let popup = document.getElementById("create-node-form")
 
    popupManager.showPopup("create-node-form")
 
 }
 
 let selectedNode = null
 
 function selectNode(node) {
    selectedNode = node
 }
 
 function removeSelectedNode() {
    if (selectedNode == null)
       throw "No node selected!"
    mainCanvas.removeNode(selectedNode)
    mainCanvas.scheduleAutosave()
 }
 
 function realizeNodeModifications() {
    if (selectedNode == null)
       throw "No node selected!"
    selectedNode.classPrefixNumber = (document.getElementById("c-prefixnum-modify").value).toUpperCase()
    selectedNode.className = document.getElementById("c-name-modify").value
    selectedNode.classUnit = document.getElementById("c-unit-modify").value
    selectedNode.classMajor = document.getElementById("c-major-modify").value
    selectedNode.classDescription = document.getElementById("c-description-modify").value
    selectedNode.tabColor = document.getElementById("c-color-modify").value
    selectedNode.prereqs = (document.getElementById("c-prereq-modify").value.toUpperCase()).trim().split(/\s*,\s*/).filter(entry => /\S/.test(entry));
    mainCanvas.scheduleAutosave()
 
 }
 
 function viewNode() {
 
    popupManager.hideLastPopup();
    popupManager.showPopup('view-node-form');
 
    let viewEmpty = true;
 
    //viewing variables
    let viewPrefixNumber = document.getElementById("viewPrefixNumber");
    let viewClassName = document.getElementById("viewClassName");
    let viewClassUnit = document.getElementById("viewClassUnit");
    let viewClassMajor = document.getElementById("viewClassMajor");
    let viewClassDescription = document.getElementById("viewClassDescription");
    let viewPrereqs = document.getElementById("viewPrereqs");
 
    //viewing label variables
    let viewDescLabel = document.getElementById("viewDescLabel");
    let viewMajorLabel = document.getElementById("viewMajorLabel");
    let viewPrereqsLabel = document.getElementById("viewPrereqsLabel");
 
    //view PrefixNumber
    if (selectedNode.classPrefixNumber) {
       viewPrefixNumber.innerHTML = selectedNode.classPrefixNumber.toUpperCase();
       viewEmpty = false;
    }
 
    //view ClassName
    if (selectedNode.className) {
       viewClassName.innerHTML = selectedNode.className;
       viewEmpty = false;
    }
 
    //view ClassUnit 
    if (selectedNode.classUnit) {
       viewClassUnit.innerHTML = " (" + selectedNode.classUnit + ")"
       viewEmpty = false;
    } else {
       viewClassUnit.innerHTML = null;
    }
 
    //view Major
    if (selectedNode.classMajor) {
       viewClassMajor.innerHTML = selectedNode.classMajor;
       viewMajorLabel.innerHTML = "Major";
       viewEmpty = false;
    } else {
       viewMajorLabel.innerHTML = "";
       viewClassMajor.innerHTML = null;
    }
 
    //view Description 
    if (selectedNode.classDescription) {
       viewClassDescription.innerHTML = selectedNode.classDescription;
       viewDescLabel.innerHTML = "Description";
       viewEmpty = false;
    } else {
       viewDescLabel.innerHTML = "";
       viewClassDescription.innerHTML = null;
    }
 
    //view Prerequisites
    if (selectedNode.prereqs.length > 1) {
       viewPrereqsLabel.innerHTML = "Prerequisite(s)";
       viewPrereqs.innerHTML = selectedNode.prereqs.join(', ');;
       viewEmpty = false;
 
       console.log("There exists more than one prereq element");
       console.log(selectedNode.prereqs);
 
    } else if (selectedNode.prereqs.length == 1) {
       if (selectedNode.prereqs.includes("", 0)) {
          viewPrereqsLabel.innerHTML = null;
          viewPrereqs.innerHTML = null;
          console.log("The one element is empty");
          console.log(selectedNode.prereqs.includes("", 0));
       } else {
          viewPrereqsLabel.innerHTML = "Prerequisite(s)";
          viewPrereqs.innerHTML = selectedNode.prereqs;
          viewEmpty = false;
          console.log("There exists exactly one prereq element");
          console.log(selectedNode.prereqs);
       }
    } else if (selectedNode.prereqs.length <= 0) {
       viewPrereqsLabel.innerHTML = null;
       viewPrereqs.innerHTML = null;
       console.log("I am less than or equal to 0");
       console.log(selectedNode.prereqs);
    }
 
    //view tabColor as Border on viewNode PopUp
    document.getElementById("view-node-body").style.borderColor = selectedNode.tabColor;
 
    if (viewEmpty) {
       viewPrefixNumber.innerHTML = "NO DATA SET";
       viewClassName.innerHTML = "Please enter class information and save your changes";
    } else {
       viewPrefixNumber.innerHTML = selectedNode.classPrefixNumber.toUpperCase();
       viewClassName.innerHTML = selectedNode.className;
 
    }
 
 }
 
 // Target HTML Element: modify-node-form
 // Used for the button to delete the selected node
 function onClickDeleteSelectedNode() {
    let popup = document.getElementById("modify-node-form-body")
 
    removeSelectedNode()
    popupManager.hideLastPopup()
    document.getElementById('modify-node-form-over').style.display = 'none'
    popup.reset()
 }
 
 // Target HTML Element: modify-node-form
 // Used to confirm modifications to the selected node
 function onClickModifyNode() {
 
    if (validatePreInput("c-prefixnum-modify") == true && validateUnitInput("c-unit-modify") == true) {
       let popup = document.getElementById("modify-node-form-body")
       realizeNodeModifications()
       viewNode()
       //popupManager.hideLastPopup()
       //document.getElementById('modify-node-form-over').style.display='none'
       //popup.reset()
    }
 }