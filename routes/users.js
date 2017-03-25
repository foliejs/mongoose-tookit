const express = require('express')
const router = express.Router()

// find user
router.get('/', (req, res) => {
  db.User
    .find({})
    .then((result) => res.send(result))
})

// create user
router.post('/', (req, res) => {
  let userModel = {
    name: 'cute-body',
    password: 'ctf'
  }
  let user = new db.User(userModel)
  user
    .save()
    .then(result => res.send(result))
    .catch(err => res.send(500, err))
})

// modify user
router.put('/', (req, res) => {
  db.User
    .update({name: 'cute-body'}, {
      '$set': {
        password: '123'
      }
    })
    .exec()
    .then(result => res.send(result))
    .catch(err => res.send(500, err))
})

// modify user
router.delete('/', (req, res) => {
  db.User
    .remove({name: 'cute-body'})
    .exec()
    .then(result => res.send(result))
    .catch(err => res.send(500, err))
})

module.exports = router

