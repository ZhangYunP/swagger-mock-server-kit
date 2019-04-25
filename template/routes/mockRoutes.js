
      const Mock = require('mockjs')

      module.exports = app => {
    
         app.get('/api/v1/users', (req, res) => {
           res.json(Mock.mock([
  {
    "id": "@integer(60, 100)",
    "name": "@string",
    "gender": 0,
    "email": "@string",
    "avatar": "@string",
    "nickname": "@string",
    "role": "@integer(60, 100)",
    "phone": "@string",
    "create_time": "@datetime",
    "update_time": "@datetime",
    "isValidate": "@boolean"
  }
]));
         })
       
        app.get('/api/foo', (req, res) => {
          res.json({
            bar: 'baz'
          })
        })
    
      }
    