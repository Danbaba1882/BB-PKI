const mongoose = require('mongoose')
const schema = mongoose.Schema;

const domainOwner = new schema ({
    subjectName: String,
    commonName: String,
    organisation: String
})


module.exports = mongoose.model("domainOwner", domainOwner);