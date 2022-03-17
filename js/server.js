
const express = require('express')
const app = express()
app.set('port', 3000)

// Host assets
app.use('/css', express.static(__dirname + '../../css/'))
app.use('/img', express.static(__dirname + '../../img/'))
app.use('/js', express.static(__dirname + '../../js/'))

// ========= GRADFLOW APP =========
app.get('/gradflow.html', (req, res) => {
    res.redirect('/app')
})
app.get('/app', (req, res) => {
    res.sendFile('gradflow.html', { root: __dirname + '../../'})
})

// ========= WELCOME PAGE =========
app.get('/welcome', (req, res) => {
    res.sendFile('index.html', { root: __dirname + '../../'})
})

// No path handler
app.get('/', (req, res) => {
    res.redirect('/welcome')
})

// Default handler
app.use((req, res) => {
    res.redirect('/welcome')
})

app.listen(app.get('port'), () => {
    console.log("Express Server active at: http://localhost:" + app.get('port'))
})