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
  .post(async (req, res) => {
    if (typeof req.body['email'] !== 'string') {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      let template = await fs.readFile('/srv/opt/Linux-Rocks/register.ejs', { encoding: 'utf8' })
      res.write(ejs.render(template, {
        title: 'Email Address Not Provided',
        description: 'It appears that you did not submit your email address for registration',
        contentBody: `<p>
  Please enter your email address in the registration page and click &quot;Register&quot; to register for your vote.
</p>
<p>
  <a href="/" class="button">Go Back</a>
</p>`
      }))
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
