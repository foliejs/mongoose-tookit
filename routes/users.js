const express = require('express')
const router = express.Router()
const db = require('../model')

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

// Mongo Aggregate Demo
router.get('/aggregate/link', (req, res) => {
  db.User.aggregate([{
    $lookup: { // 多表关联
      from: 'peoples',
      localField: 'people',
      foreignField: '_id',
      as: 'people'
    }
  }, {
    $match: {   // 条件筛选
      '$or': [
        { 'people.name': 'rose_people' },
        { 'people.email.mail': 'jack@qq.com' }
      ]
    }
  }, {
    $sort: { _id: -1 } // 是否排序
  }, {
    $skip: 1    // 是否分页
  }, {
    $limit: 5   // 返回条数限制
  }, {
    $project: { // 调整返回数据结构
      name: 1,
      age: 1
    }
  }, {
    $group: {  // 数据分组求和
      _id: null,
      count: { $sum: 1 }
    }
  }])
    .then((result) => res.send(result))
    .catch(e => console.error(e))
})

router.get('/populate/link', (req, res) => {
  console.log('user populate')
  db.User
  .find({}).populate('people')
  .then(users => {
    res.send(users)
  })
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
    name: 'jack_02',
    password: '456',
    age: 2
  }
  const peopleModel = {
    name: 'jack_02_people',
    email: [{
      address: 'jack_02 address 02',
      mail: 'jack@qq.com'
    }, {
      address: 'jack_02 address 02',
      mail: 'jack@qq.com'
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
