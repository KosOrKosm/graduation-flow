/**
 * @ Author: Jacob Fano
 * @ Create Time: 2022-03-17 12:10:58
 * @ Modified by: Jacob Fano
 * @ Modified time: 2022-04-14 12:57:56
 */

const cors = require('cors')
const express = require('express')
const app = express()
const root = __dirname + '../../'
app.set('port', 3000)

// Host assets
app.use(cors())
app.use('/css', express.static(root + 'css/'))
app.use('/img', express.static(root + 'img/'))
app.use('/js', express.static(root + 'js/'))

// ========= GRADFLOW APP =========
app.get('/gradflow.html', (req, res) => {
    res.redirect('/app')
})
app.get('/app', (req, res) => {
    res.sendFile('gradflow.html', { root: root})
})
// ========= DATABASE CONNECTION =========
app.get('/query', (req, res) => {
    
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'college_planner'
      })
      
      connection.connect()
      
      connection.query(`SELECT Course as classCode, Description as className from class_list where Course = ${req.query.entry}`, (err, rows, fields) => {
        if (err) throw err
        //*here we are sending the result of the query.
        res.status(200).send(JSON.stringify(rows[0]))
        
        //console.log(rows[0].Course + rows[0].Dept)
        //* this can be used to test the values that are coming in from the query*\\
      })
      
      connection.end()

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
