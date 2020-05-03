require('dotenv').config();

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// Database connection
mongoose.connect(process.env.CONNECTIONDB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
mongoose.connection.once('open',function(){
    console.log('Connected to database');
}).on('error',function(error){
    console.log('There is an error in connecting database: ' + error);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use(express.json())

app.set('views', 'views')
app.set('view engine', 'ejs')

// Router
const router = require('./router')
app.use('/', router)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server Started on port ${port}`))
