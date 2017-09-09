const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = new Schema({
  name: { type: String, require: true },
  isDeleted: { type: Boolean, default: false },
  isCreated: { type: Date, default: Date.now() },
  email: [{
    address: { type: String, default: '' },
    mail: String
  }]
})
