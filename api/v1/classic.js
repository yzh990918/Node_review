const Router = require('koa-router')
const router = new Router()
const {PositiveIntegerValidator} = require('../validator/validator')

router.post('/v1/:id/book/latest',(ctx,next)=>{
  // 路径携带参数
  const path = ctx.params
  // 请求参数
  const query = ctx.request.query
  // 头部参数
  const headers = ctx.request.header
  // 请求json参数
  const body=ctx.request.body
  // 定义抛出异常
  const v = new PositiveIntegerValidator().validate(ctx)
  ctx.body= {key:"book"}

})


module.exports=router
