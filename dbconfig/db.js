const mongoose = require('mongoose')
const MONGODB_URI = "http://127.0.0.1:27017"
const URI = ""
const options = {useNewUrlParser: true, useUnifiedTopology: true}
mongoose.connect(process.env.URI || MONGODB_URI, options)
mongoose.connection.on('open',(err)=>{
    if (err){
        console.log(err)
    }
    console.log('bbpki server has been connected to database...')
})