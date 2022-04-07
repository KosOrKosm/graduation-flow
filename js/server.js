/**
 * @ Author: Jacob Fano
 * @ Create Time: 2022-03-17 12:10:58
 * @ Modified by: Jacob Fano
 * @ Modified time: 2022-03-17 12:52:20
 */

const express = require('express')
const mysql = require('mysql')
const app = express()
const root = __dirname + '../../'
app.set('port', 3000)

// Host assets
app.use('/css', express.static(root + 'css/'))
app.use('/img', express.static(root + 'img/'))
app.use('/js', express.static(root + 'js/'))


// =========   DATABASE   =========
app.get('/query', (req, res) => {
    res.send("Hello Class!")
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'college_planner'
      })
      
      connection.connect()
      
      connection.query(`SELECT * from class_list where Course = ${req.query.class}`, (err, rows, fields) => {
        if (err) throw err
      
        console.log('The solution is: ',  rows[0].Course + rows[0].Dept , " ",  rows[0].Description)
      })
      
      connection.end()

})

// ========= GRADFLOW APP =========
app.get('/gradflow.html', (req, res) => {
    res.redirect('/app')
})
app.get('/app', (req, res) => {
    res.sendFile('gradflow.html', { root: root})
})

// =========  ABOUT PAGE  =========
app.get('/about.html', (req, res) => {
    res.redirect('/about')
})
app.get('/about', (req, res) => {
    res.sendFile('about.html', { root: root})
})

// ========= WELCOME PAGE =========
app.get('/welcome', (req, res) => {
    res.sendFile('index.html', { root: root})
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
