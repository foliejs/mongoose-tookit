const mongoose = require('mongoose')
const config = require('config')
mongoose.connect(`mongodb://${config.mongo.host}:${config.mongo.post}/tookit`, err => console.log(err))

exports.User = mongoose.model('users', require('./user'))
exports.People = mongoose.model('peoples', require('./people'))
