const mongoose = require('mongoose')
const schema = mongoose.Schema;

const domainOwner = new schema ({
    raName: String,
    commonName: String,
    organisation: String
})


module.exports = mongoose.model("rAuthority", rAuthority);