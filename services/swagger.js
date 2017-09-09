const swaggerJSDoc = require('swagger-jsdoc')

exports.swagger = function () {
  const options = {
    swaggerDefinition: {
      info: {
        title: 'cute boy', // Title (required)
        version: '1.0.0' // Version (required)
      }
    },
    apis: ['./users.js'] // Path to the API docs
  }

  // Initialize swagger-jsdoc -> returns validated swagger spec in json format
  return swaggerJSDoc(options)
}
