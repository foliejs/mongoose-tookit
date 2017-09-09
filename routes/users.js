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

// $project

// Reshapes a document stream. $project can rename, add, or remove fields as well as create computed values and sub-documents.

// $match

// Filters the document stream, and only allows matching documents to pass into the next pipeline stage.$match uses standard MongoDB queries.

// $limit

// Restricts the number of documents in an aggregation pipeline.

// $skip

// Skips over a specified number of documents from the pipeline and returns the rest.

// $unwind

// Takes an array of documents and returns them as a stream of documents.

// $group

// Groups documents together for the purpose of calculating aggregate values based on a collection of documents.

// $sort

// Takes all input documents and returns them in a stream of sorted documents.

// $geoNear

// Returns an ordered stream of documents based on proximity to a geospatial point.

// $unwind：将数组元素拆分为独立字段
// Mongo Aggregate Demo
router.get('/aggregate/link', (req, res) => {
  db.User.aggregate([{
    // fromCollection => 需要连接的Collection
    // local => 当前Collection中需要连接的字段
    // from => 外连Collection中连接查询的字段
    // joinedOutput => 查询结果输出到此字段中
    $lookup: { // 多表关联
      from: 'peoples',
      localField: 'people',
      foreignField: '_id',
      as: 'people'
    }
  }, {
    $match: {   // 条件筛选，$match: 滤波操作，筛选符合条件文档，作为下一阶段的输入
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
    $project: { // 调整返回数据结构 $project: 数据投影，主要用于重命名、增加和删除字段
      name: 1,
      age: 1
    }
  }, {
    $group: {  // 数据分组求和，$group 对数据进行分组
      _id: null,
      count: { $sum: 1 }
    }
  }])
    .then((result) => res.send(result))
    .catch(e => console.error(e))
})

// 聚合管道的限制

//     1.类型限制

// 在管道内不能操作 Symbol, MinKey, MaxKey, DBRef, Code, CodeWScope类型的数据( 2.4版本解除了对二进制数据的限制).

//      2.结果大小限制

// 管道线的输出结果不能超过BSON 文档的大小（16M),如果超出的话会产生错误.

//      3.内存限制

// 如果一个管道操作符在执行的过程中所占有的内存超过系统内存容量的10%的时候，会产生一个错误。

// 当$sort和$group操作符执行的时候，整个输入都会被加载到内存中，如果这些占有内存超过系统内存的%5的时候，会将一个warning记录到日志文件。同样，所占有的内存超过系统内存容量的10%的时候，会产生一个错误。

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
