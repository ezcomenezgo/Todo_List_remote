const express = require('express')

const exphbs = require('express-handlebars')

const bodyParser = require('body-parser') // 載入body-parser
const methodOverride = require('method-override') // 載入method-override
const routes = require('./routes') // 引用路由器
require('./config/mongoose')
const app = express()
const port = process.env.PORT || 3000


app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// 用app.use規定每一筆請求都需要透過body-parser進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))
// 設定每一筆請求都會透過methodOverride進行前置處理
app.use(methodOverride('_method'))
// 將request導入路由器
app.use(routes)

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})