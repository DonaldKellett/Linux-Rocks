'use strict'
const fs = require('fs').promises
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const app = express()
const port = 80

app.use(bodyParser.urlencoded({ extended: true }))

app.use('/assets', express.static('/srv/opt/Linux-Rocks/assets'))
app.use('/images', express.static('/srv/opt/Linux-Rocks/images'))

app.route(/^\/(register)?$/)
  .get(async (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.write(await fs.readFile('/srv/opt/Linux-Rocks/index.html'))
    res.end()
  })
  // FIXME: This hangs the connection indefinitely, don't know why
  .post(async (req, res) => {
    if (typeof req.body['email'] !== 'string') {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      let template = await fs.readFile('/srv/opt/Linux-Rocks/register.ejs', { encoding: 'utf8' })
      res.write(ejs.render(template, { title: 'TODO', description: 'TODO', contentBody: '<p>TODO</p>' }))
      res.end()
    } else {
      // TODO
    }
  })

app.get('/license', async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.write(await fs.readFile('/srv/opt/Linux-Rocks/LICENSE'))
  res.end()
})

app.listen(port)
