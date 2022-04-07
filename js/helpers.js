/**
 * @ Author: Jacob Fano
 * @ Create Time: 2022-04-07 13:08:19
 * @ Modified by: Jacob Fano
 * @ Modified time: 2022-04-07 13:10:16
 */


// Helper function to perform a P5 action without
// altering the draw state permenantly
function tempDrawState(p5, action) {
    p5.push()
    action()
    p5.pop()
}

async function tryUploadPrompt(onResolve) {

    // Modern download method using File System Access API
    if (window.showOpenFilePicker) {
        
        const [fileHandle] = await window.showOpenFilePicker({
            types: [{
                description: "JSON",
                accept: {
                    'application/json': ['.json']
                }
            }],
            excludeAcceptAllOptions: false,
            multiple: false
        })
        const file = await fileHandle.getFile()
        const content = await file.text()
        onResolve(content)
        return

    }

    // Backup upload method using HTML elements
    const tmpInput = document.createElement('input')
    tmpInput.type = 'file'
    tmpInput.accept = '.json'
    tmpInput.onchange = event => {
        if (tmpInput.files.length > 0) {
            const file = Array.from(tmpInput.files)[0]
            const reader = new FileReader()
            reader.onload = event => {
                onResolve(reader.result)
            }
            reader.readAsText(file)
        }
    }
    tmpInput.click()
}

async function tryDownloadPrompt(data, filename, type) {
    var file = new Blob([data], {type: type})

    // Modern download method using File System Access API
    if(window.showSaveFilePicker) {
        const fileHandle = await window.showSaveFilePicker({
            suggestedName: "canvas",
            types: [{
                description: "JSON",
                accept: {
                    'application/json': ['.json']
                }
            }]
        })
        const writable = await fileHandle.createWritable()
        await writable.write(file)
        await writable.close()
        return
    }

    // Backup download method using HTML elements
    const tmpDownloader = document.createElement("a")
    const tmpURL = URL.createObjectURL(file)
    tmpDownloader.href = tmpURL
    tmpDownloader.download = filename
    tmpDownloader.click()
    setTimeout(() => {
        window.URL.revokeObjectURL(tmpURL)
    }, 0)
}
