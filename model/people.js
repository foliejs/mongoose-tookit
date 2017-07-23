const mongoose = require('mongoose')
const Schema = mongoose.Schema
const peopleData = new Schema({
  name: String,
  email: [{
    address: String,
    mail: String
  }]
})

module.exports = peopleData