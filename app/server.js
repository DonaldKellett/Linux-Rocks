'use strict'
const fs = require('fs').promises
const express = require('express')
const app = express()
const port = 80

app.use('/assets', express.static('/srv/opt/Linux-Rocks/assets'))
app.use('/images', express.static('/srv/opt/Linux-Rocks/images'))

app
  .get(/^\/(register)?$/, async (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.write(await fs.readFile('/srv/opt/Linux-Rocks/index.html'))
    res.end()
  })

app.get('/license', async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.write(await fs.readFile('/srv/opt/Linux-Rocks/LICENSE'))
  res.end()
})

app.listen(port)
