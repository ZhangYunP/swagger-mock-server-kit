
      const Mock = require('mockjs')

      module.exports = app => {
    
         app.get('/api/v1/users', (req, res) => {
           res.json(Mock.mock(undefined));
         })
       
        app.get('/api/foo', (req, res) => {
          res.json({
            bar: 'baz'
          })
        })
    
      }
    