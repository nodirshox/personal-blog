const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const router = require('./router')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

app.set('views', 'views')
app.set('view engine', 'ejs')

app.use('/', router)

module.exports = app