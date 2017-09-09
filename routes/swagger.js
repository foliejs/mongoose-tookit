const express = require('express')
const router = express.Router()
const SwaggerService = require('../services/swagger')

router.get('/doc', (req, res) => {
  res.send(SwaggerService.swagger())
})

module.exports = router
