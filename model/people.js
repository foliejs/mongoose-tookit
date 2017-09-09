const mongoose = require('mongoose')
const Schema = mongoose.Schema

const peopleSchema = new Schema({
  name: { type: String, require: true },
  isDeleted: { type: Boolean, default: false },
  isCreated: { type: Date, default: Date.now() },
  email: [{
    address: { type: String, default: '' },
    mail: String
  }]
})

module.exports = peopleSchema
