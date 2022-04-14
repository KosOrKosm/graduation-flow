/**
 * @ Author: Jacob Fano
 * @ Create Time: 2022-04-07 13:08:19
 * @ Modified by: Jacob Fano
 * @ Modified time: 2022-04-14 11:25:04
 */

// Helper function to perform a P5 action without
// altering the draw state permenantly
function tempDrawState(p5, action) {
    p5.push()
    action()
    p5.pop()
}

function tryEndpointCall(method, url, onSuccess) {
    const req = new XMLHttpRequest()
    req.open(method, url, false)
    req.onload(event => {
        onSuccess(req.responseText)
    })
    req.send()
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


// Draws an arrow, starting at p1 and pointing to p2
function drawArrow(p5, point1, point2, color) {

    if(point1 == undefined || point2 == undefined)
        return
    
    p5.strokeWeight(4)

    // Dropshadow Effect
    tempDrawState(p5, () => {
        p5.stroke('black')
        p5.fill('black')
        p5.translate(3, 3)

        // Draw arrow body
        p5.line(point1.x, point1.y, point2.x, point2.y)

        // Draw the arrow head
        tempDrawState(p5, () => {
            p5.translate(point2.x, point2.y)
            p5.rotate(Math.atan2(point2.y - point1.y, point2.x - point1.x))
            p5.triangle(
                0, 0,
                -20, -10,
                -20, 10
            )
        })

    })
    
    p5.stroke(color)
    p5.fill(color)
    
    // Draw arrow body
    p5.line(point1.x, point1.y, point2.x, point2.y)

    // Draw arrow head
    tempDrawState(p5, () => {
        p5.translate(point2.x, point2.y)
        p5.rotate(Math.atan2(point2.y - point1.y, point2.x - point1.x))
        p5.triangle(
            0, 0,
            -20, -10,
            -20, 10
        )
    })
    
}
