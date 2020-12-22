const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')

const bodyParser = require('body-parser') // 載入body-parser
const methodOverride = require('method-override') // 載入method-override
const routes = require('./routes') // 引用路由器
const app = express()
const port = 3000

mongoose.connect('mongodb://localhost/todo-list', { useNewUrlParser: true, useUnifiedTopology: true })
// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

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