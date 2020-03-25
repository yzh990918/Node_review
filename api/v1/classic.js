const Router = require('koa-router')
const { flow } = require('../models/flow')
const router = new Router({
  prefix: '/v1/classic'
})
const { Auth } = require('../../middlewares/auth')
const { Art } = require('../models/art')

//  使用用户权限校验中间价 必须放在路由中间件前面
router.get('/latest', new Auth().m, async (ctx, next) => {
  // 取出index最大的数据 获取id号和type 降序排列 取出一条数据
  const latest = await flow.findOne({
    order: [['index', 'DESC']]
  })
  // 获取实体
  let art = await Art.getOne(latest.art_id, latest.type)
  // 合并属性进入 art
  art.setDataValue('index', latest.index)
  ctx.body = art
})

module.exports = router
