const express = require('express')
const router = express.Router()

/**
 * @swagger
 * /:
 *   get:
 *     description: find user
 *     produces:
 *       - application/json
 *     parameters:
 *     responses:
 *       200:
 *         description: find success
 */
router.get('/', (req, res) => {
  db.User
    .find({})
    .then((result) => res.send(result))
})

/**
 * @swagger
 * /people:
 *   get:
 *     description: find unique people
 *     produces:
 *       - application/json
 *     parameters:
 *     responses:
 *       200:
 *         description: find success
 */
router.get('/people', (req, res) => {
  db.User
    .find({})
    .populate({path: 'people', match: {'email.mail': 'demo@tb.com'}, options: {'email.$': 1}})
    .then((result) => res.send(result))
    .catch(e => console.error(e))
})

/**
 * @swagger
 * /people/array:
 *   get:
 *     description: find unique people email
 *     produces:
 *       - application/json
 *     parameters:
 *     responses:
 *       200:
 *         description: find success
 */
router.get('/people/array', (req, res) => {
  db.People.aggregate([
    {$match: {'email.mail': 'demo1@tb.com', name: 'dell'}},
    {
      $project: {
        email: {
          $filter: {
            input: '$email',
            as: 'email',
            cond: {$eq: ['$$email.mail', 'demo1@tb.com']}
          }
        },
        name: 1
      }
    }])
    .then((result) => res.send(result))
    .catch(e => console.error(e))
})

/**
 * @swagger
 * /:
 *   post:
 *     description: create user
 *     produces:
 *       - application/json
 *     parameters:
 *     responses:
 *       200:
 *
 */
router.post('/', (req, res) => {
  const userModel = {
    name: 'cute',
    password: 'ctf'
  }
  const peopleModel = {
    name: 'people',
    email: [{
      address: '2',
      mail: '2@qq.com'
    }, {
      address: '3',
      mail: '2@qq.com'
    }]
  }
  const people = new db.People(peopleModel)
  people
    .save()
    .then(peopleData => {
      userModel.people = peopleData._id
      const user = new db.User(userModel)
      return user.save()
    })
    .then(result => res.send(result))
    .catch(err => res.send(500, err))
})

/**
 * @swagger
 * /:
 *   put:
 *     description: modify user
 *     produces:
 *       - application/json
 *     parameters:
 *     responses:
 *       200:
 */
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

/**
 * @swagger
 * /:
 *   delete:
 *     description: delete user
 *     produces:
 *       - application/json
 *     parameters:
 *     responses:
 *       200:
 *         description: delete success
 */
router.delete('/', (req, res) => {
  db.User
    .remove({name: 'cute-body'})
    .exec()
    .then(result => res.send(result))
    .catch(err => res.send(500, err))
})

module.exports = router

