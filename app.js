const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const Todo = require('./models/todo') //載入Todo model
const bodyParser = require('body-parser') // 載入body-parser
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

app.get('/', (req, res) => {
  Todo.find() // 取出Todo model裡的所有資料
    .lean() // 把Mongoose的Model物件轉換成乾淨的Javascript資料陣列
    .then(todos => res.render('index', { todos })) // 將資料傳給index樣板
    .catch(error => console.log(error)) //錯誤處理
})

app.get('/todo/new', (req, res) => {
  return res.render('new')
})

app.post('/todos', (req, res) => {
  const name = req.body.name // 從req.body拿出表單裡的name資料
  return Todo.create({ name }) // 存入資料庫
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render('detail', { todo }))
    .catch(error => console.log(error))
})

app.get('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render('edit', { todo }))
    .catch(error => console.log(error))
})

app.post('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  const { name, isDone } = req.body
  // console.log(req.body)
  return Todo.findById(id)
    .then(todo => {
      todo.name = name
      todo.isDone = isDone === 'on'
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(error => console.log(errors))
})

app.post('/todos/:id/delete', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .then(todo => todo.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))

})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})