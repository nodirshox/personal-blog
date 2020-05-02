require('dotenv').config();
const mongoose=require('mongoose')

const connectionString = process.env.CONNECTIONDB

mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}, function(err, client) {
    const app = require('./app')
    var port = process.env.PORT
    app.listen(port)
}) 