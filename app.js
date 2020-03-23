const koa = require('koa')
const Router = require('koa-router')
const parser = require('koa-bodyparser')
const exception = require('./middlewares/execption')
require('./api/models/user')
const app = new koa()

const InitManager = require('./core/init')

app.use(exception)
app.use(parser())
InitManager.initCore(app)
app.listen(3000,()=>{
  console.log('http监听端口3000')
})
