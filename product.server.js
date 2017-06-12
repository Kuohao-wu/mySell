let express = require('express')
let app = express()
let config = require('./config/index')

let port = process.env.PORT || config.build.port

let router = express.Router()

router.get('/', (req, res, next) => {
  req.url = '/index.html'
  next()
})

app.use(router)

let appData = require('./data.json')
let seller = appData.seller
let goods = appData.goods
let ratings = appData.ratings

let apiRouter = express.Router()

apiRouter.get('/seller', function (req, res) {
  res.json({errno: 0, data: seller})
})

apiRouter.get('/goods', function (req, res) {
  res.json({errno: 0, data: goods})
})

apiRouter.get('/ratings', function (req, res) {
  res.json({errno: 0, data: ratings})
})

app.use('/api', apiRouter)

app.use(express.static('./dist'))

module.exports = app.listen(port, err => {
  if (err) {
    return false
  }
})
