const Router = require('koa-router')
const router = new Router(
  {
    prefix:'/v1/classic'
  }
)
const {Auth} = require('../../middlewares/auth')
const { PositiveIntegerValidator } = require('../validator/validator')

//  使用用户权限校验中间价 必须放在路由中间件前面
router.get('/latest',new Auth().m, (ctx, next) => {
  ctx.body = ctx.auth.uid
  // // 路径携带参数
  // const path = ctx.params
  // // 请求参数
  // const query = ctx.request.query
  // // 头部参数
  // const headers = ctx.request.header
  // // 请求json参数
  // const body = ctx.request.body
  // // 定义抛出异常
  // const v = new PositiveIntegerValidator().validate(ctx)
  // ctx.body = { key: 'book' }
})

module.exports = router
