
      const Mock = require('mockjs')

      module.exports = (app, api) => {
        const operation = api.getOperation();
    
         app.get('/api/v1/users', (req, res) => {
          
        const results = operation.validateRequest(res);
    
        if (!results.errors.length && !results.warnings.length) {
          res.json(Mock.mock([
  {
    "id": "@integer(60, 100)",
    "name": "@string",
    "gender": "@integer(60, 100)",
    "email": "@email",
    "avatar": "@string",
    "nickname": "@string",
    "role": "@integer(60, 100)",
    "phone": "@string",
    "create_time": "@datetime",
    "update_time": "@datetime",
    "isValidate": "@boolean"
  }
]));
        } else {
          res.json({
            code: 40002,
            message: "invalidate response"
          })
        }
         })
       
      }
    