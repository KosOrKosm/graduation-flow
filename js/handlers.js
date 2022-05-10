/**
 * @ Author: Jacob Fano
 * @ Create Time: 2022-03-11 14:42:55
 * @ Modified by: Jacob Fano
 * @ Modified time: 2022-05-10 11:59:38
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
    mainCanvas.loadFromBrowser()
}

function ExportPNG() {
    Canvas.getRegionP5("canvas-container").saveCanvas('myGradFlow', 'png')
}

function ExportJPEG() {
    Canvas.getRegionP5("canvas-container").saveCanvas('myGradFlow', 'jpeg')
}

function onClickCreateCustomNode() {
    // let btn = document.getElementById("btn-create-custom")
    let popup = document.getElementById("create-node-form-body")

    let customNode = new FlowNode(0, 300)
    customNode.classPrefixNumber = document.getElementById("c-prefixnum-create").value
    customNode.className = document.getElementById("c-name-create").value
    customNode.classUnit = document.getElementById("c-unit-create").value
    customNode.classMajor = document.getElementById("c-major-create").value
    customNode.classDescription = document.getElementById("c-description-create").value
    customNode.tabColor = document.getElementById("c-color-create").value
    customNode.prereqs = document.getElementById("c-prereq-create").value.split(',')
    mainCanvas.addNode(customNode)
    mainCanvas.scheduleAutosave()
    popupManager.hideLastPopup()
    popup.reset()

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
    selectedNode.classPrefixNumber = document.getElementById("c-prefixnum-modify").value
    selectedNode.className = document.getElementById("c-name-modify").value
    selectedNode.classUnit = document.getElementById("c-unit-modify").value
    selectedNode.classMajor = document.getElementById("c-major-modify").value
    selectedNode.classDescription = document.getElementById("c-description-modify").value
    selectedNode.tabColor = document.getElementById("c-color-modify").value
    selectedNode.prereqs = document.getElementById("c-prereq-modify").value.split(',')
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
        viewPrereqs.innerHTML = selectedNode.prereqs;
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


    let popup = document.getElementById("modify-node-form-body")

    realizeNodeModifications()
    //popupManager.hideLastPopup()
    //document.getElementById('modify-node-form-over').style.display='none'
    //popup.reset()




}
