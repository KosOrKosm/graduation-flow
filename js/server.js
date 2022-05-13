/**
 * @ Author: Jacob Fano
 * @ Create Time: 2022-03-17 12:10:58
 * @ Modified by: Jacob Fano
 * @ Modified time: 2022-05-12 14:22:03
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
 
 // ========= GRADFLOW APP =========
 app.get('/gradflow.html', (req, res) => {
    res.redirect('/app')
 })
 app.get('/app', (req, res) => {
    res.sendFile('gradflow.html', {
       root: root
    })
 })
 
 // ========= DATABASE CONNECTION =========
 app.get('/query', (req, res) => {
 
    console.log('REQ RECIEVED: /query GET')
    const connection = mysql.createConnection({
       host: 'localhost',
       user: 'root',
       password: '',
       database: 'student'
    })
 
    connection.connect()
 
    //made some changes to the information that is being returned
    connection.query(`SELECT  CODE_ as classPrefixNumber, TITLE as className, UNITS as classUnit, MAJOR as classMajor, DESCR as classDescription, TABCOLOR as tabColor, PREREQ as prereqs from stats `, (err, rows, fields) => {
       // console.log(rows[20].prereqs)
       for (row of rows) {
          row.prereqs = row.prereqs.split(',')
       }
 
       if (err) throw err
       //*here we are sending the result of the query.
       res.status(200).send(JSON.stringify(rows))
       console.log(JSON.stringify(rows))
       //console.log(rows[0].Course + rows[0].Dept)
       //* this can be used to test the values that are coming in from the query*\\
    })
 
    connection.end()
 
 })
 
 
 // =========  GRADMAP PAGE  =========
 
 app.get('/gradmap.html', (req, res) => {
    res.redirect('/gradmap')
 })
 app.get('/gradmap', (req, res) => {
    res.sendFile('gradmap.html', {
       root: root
    })
 })
 
 
 // =========  ABOUT PAGE  =========
 app.get('/about.html', (req, res) => {
    res.redirect('/about')
 })
 app.get('/about', (req, res) => {
    res.sendFile('about.html', {
       root: root
    })
 })
 
 // ========= WELCOME PAGE =========
 app.get('/welcome', (req, res) => {
    res.sendFile('index.html', {
       root: root
    })
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