require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT

app.get('/', (req, res) => {
  res.send('Hello World! <h1>HOME</h1>')
})

app.get('/about', (req, res) => {
  res.send('Hello World! <h1>ABOUT</h1>')
})

app.get('/contact', (req, res) => {
  res.send('Hello World! <h1>CONTACT</h1>')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
