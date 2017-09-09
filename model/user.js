const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  _userId: Schema.ObjectId,
  name: String,
  password: String,
  age: { type: Number },
  people: {
    type: Schema.Types.ObjectId, ref: 'peoples'
  }
})

module.exports = userSchema
