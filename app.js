/*
 * @Author: 努力中的杨先生
 * @Date: 2020-03-21 19:14:48
 * @Descripttion: 
 * @version: 
 */
const koa = require('koa')
const Router = require('koa-router')
const parser = require('koa-bodyparser')
const exception = require('./middlewares/execption')
const app = new koa()
const path = require('path')
const statics = require('koa-static')

const InitManager = require('./core/init')
app.use(exception)
app.use(parser())
app.use(statics(path.join(__dirname,'./public')))
InitManager.initCore(app)
app.listen(3000, () => {
  console.log('http监听端口3000')
})
