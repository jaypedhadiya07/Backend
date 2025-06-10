require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World! <h1>HOME</h1>')
})

app.get('/about', (req, res) => {
  res.send('Hello World! <h1>ABOUT</h1>')
})

app.get('/contact', (req, res) => {
  res.send('Hello World! <h1>CONTACT</h1>')
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${port}`)
})
