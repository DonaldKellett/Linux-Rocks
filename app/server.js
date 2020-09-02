'use strict'
const fs = require('fs').promises
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const validator = require('email-validator')
const mariadb = require('mariadb')
const util = require('util')
const crypto = require('crypto')
const sha512 = require('js-sha512').sha512
const nodemailer = require('nodemailer')
const app = express()
const port = 80

app.use(bodyParser.urlencoded({ extended: true }))

app.use('/assets', express.static('/srv/opt/Linux-Rocks/assets'))
app.use('/images', express.static('/srv/opt/Linux-Rocks/images'))

app.route(/^\/(register)?$/)
  .get(async (req, res, next) => {
    try {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.write(await fs.readFile('/srv/opt/Linux-Rocks/index.html'))
      res.end()
    } catch (err) {
      next(err)
    }
  })
  .post(async (req, res, next) => {
    try {
      let template = await fs.readFile('/srv/opt/Linux-Rocks/register.ejs', { encoding: 'utf8' })
      if (typeof req.body['email'] !== 'string') {
        res.writeHead(200, { 'Content-Type': 'text/html' })
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
      } else if (!validator.validate(req.body['email'])) {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.write(ejs.render(template, {
          title: 'Email Address Invalid',
          description: 'It appears that you did not provide a valid email address for registration',
          contentBody: `<p>
  Please enter a valid email address in the registration page and click &quot;Register&quot; to register for your vote.
</p>
<p>
  <a href="/" class="button">Go Back</a>
</p>`
        }))
        res.end()
      } else {
        let databaseIP = await fs.readFile('/opt/Linux-Rocks/database_ip.txt', { encoding: 'utf8' })
        databaseIP = databaseIP.trim()
        let conn = await mariadb.createConnection({
          host: databaseIP,
          user: 'voters',
          password: 'voters-pw',
          database: 'voters'
        })
        let email = conn.escape(req.body['email'])
        let rows = await conn.query(`SELECT * FROM voters WHERE email = ${email}`)
        if (rows.length > 0) {
          res.writeHead(200, { 'Content-Type': 'text/html' })
          res.write(ejs.render(template, {
            title: 'Email Already Registered',
            description: 'It appears that you have already registered this email address for voting',
            contentBody: `<p>
  Please note that each email address can only be registered once for voting.
  If you have already cast your vote, you may no longer change your vote.
  If you have previously registered this email address but have yet to cast your vote, please check your inbox for our email.
  Our email should include a one-time password (OTP) which you should enter in the voting page along with your email address to verify your identity when voting.
</p>
<p>
  <a href="/vote" class="button primary">Proceed to Vote</a> <a href="/" class="button">Go Back</a>
</p>`
          }))
          res.end()
        } else {
          let otp = crypto.randomBytes(16).toString('hex')
          let otpHash = sha512(otp)
          await conn.query(`INSERT INTO voters (email, otp_hash, vote_cast) VALUES (${email}, '${otpHash}', 0)`)
          let mailserverIP = await fs.readFile('/opt/Linux-Rocks/mailserver_ip.txt', { encoding: 'utf8' })
          mailserverIP = mailserverIP.trim()
          let transporter = nodemailer.createTransport({
            host: mailserverIP,
            port: 25,
            secure: false
          })
          await transporter.sendMail({
            from: 'webmaster@linux-rocks.com',
            to: req.body['email'],
            subject: '[Linux Rocks] Here is your OTP for your vote',
            text: `Hello voter,

It seems you have registered for a vote at "Linux Rocks". If not, your email address was probably used by someone else to register for a vote - in that case, please inform webmaster@linux-rocks.com of the incident immediately.

Your one-time password (OTP) for verifying your identity during the vote is as follows:

${otp}

Please enter your OTP along with your email address to authenticate yourself when voting for your favorite Linux distribution. Happy voting!`,
            html: `<p>Hello voter,</p>

<p>It seems you have registered for a vote at &quot;Linux Rocks&quot;. If not, your email address was probably used by someone else to register for a vote - in that case, please inform webmaster@linux-rocks.com of the incident immediately.</p>

<p>Your one-time password (OTP) for verifying your identity during the vote is as follows:</p>

<p>${otp}</p>

<p>Please enter your OTP along with your email address to authenticate yourself when voting for your favorite Linux distribution. Happy voting!</p>`
          })
          res.writeHead(200, { 'Content-Type': 'text/html' })
          res.write(ejs.render(template, {
            title: 'Registration Successful',
            description: 'A confirmation email with your one-time password (OTP) has been sent to your account',
            contentBody: `<p>
  Please check your inbox for our email. Once you receive our email, proceed to our voting page and enter the supplied OTP along with your email address to authenticate your vote. Happy voting!
</p>
<p>
  <a href="/vote" class="button primary">Proceed to Vote</a> <a href="/" class="button">Go Back</a>
</p>`
          }))
          res.end()
        }
        await conn.end()
      }
    } catch (err) {
      next(err)
    }
  })

app.get('/license', async (req, res, next) => {
  try {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.write(await fs.readFile('/srv/opt/Linux-Rocks/LICENSE'))
    res.end()
  } catch (err) {
    next(err)
  }
})

app.listen(port)
