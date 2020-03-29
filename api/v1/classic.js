const Router = require('koa-router')
const { flow } = require('../models/flow')
const router = new Router({
  prefix: '/v1/classic'
})
const { Auth } = require('../../middlewares/auth')
const {book} =require('../models/book')
const { Art } = require('../models/art')
const {Favor} = require('../models/favor')
const {Op} = require('sequelize')
const { IndexValidator,ClassicValidator,SearchValidator,PositiveIntegerValidator} =require('../validator/validator')
const {NotFoundException} =require('../../core/http-execption')

//  使用用户权限校验中间价 必须放在路由中间件前面
router.get('/latest', new Auth().m, async (ctx, next) => {
  // 取出index最大的数据 获取id号和type 降序排列 取出一条数据
  const latest = await flow.findOne({
    order: [['index', 'DESC']]
  })
  // 获取实例
  let art = await Art.getOne(latest.art_id, latest.type)
  const like_status = await Favor.Userlike(ctx.auth.uid,latest.art_id,latest.type)
  // 合并属性进入 art
  art.setDataValue('index', latest.index)
  art.setDataValue('like_status',like_status)
  ctx.body = art
})

// 获取下一期

router.get('/:index/next',new Auth().m,async(ctx)=>{
  // 校验 获取art_id type 获取实例 然后增加属性
 const v = await new IndexValidator().validate(ctx)
 const index = v.get('path.index')
 const next = await flow.findOne({
   where:{
     index:index + 1  
   }
 })
 if(!next){
   throw new NotFoundException('没有下一期了')
 }
 let art = await Art.getOne(next.art_id,next.type)
 const like_status = await Favor.Userlike(ctx.auth.uid,next.art_id,next.type)
 art.setDataValue('index',next.index)
 art.setDataValue('like_status',like_status)
 ctx.body = art
})

// 获取上一期


router.get('/:index/previous',new Auth().m,async(ctx)=>{
  // 校验 获取art_id type 获取实例 然后增加属性
 const v = await new IndexValidator().validate(ctx)
 const index = v.get('path.index')
 const next = await flow.findOne({
   where:{
     index:index - 1 
   }
 })
 if(!next){
   throw new NotFoundException('没有上一期了')
 }
 let art = await Art.getOne(next.art_id,next.type)
 const like_status = await Favor.Userlike(ctx.auth.uid,next.art_id,next.type)
 art.setDataValue('index',next.index)
 art.setDataValue('like_status',like_status)
 ctx.body = art
})

// 获取点赞情况 
router.get('/:type/:id/favor',new Auth().m ,async(ctx)=>{
  const v = await new ClassicValidator().validate(ctx)
  const type = parseInt(v.get('path.type'))
  // 校验器转型后 路由并不会转型
  const id = v.get('path.id')
  let favor = await flow.findOne({
    where:{
      art_id:id,
      type:type
    }
  })
  if(!favor){
    throw new NotFoundException('找不到资源')
  }
  let art = await Art.getOne(id,type)
  const like_status = await Favor.Userlike(ctx.auth.uid,id,type)

  ctx.body = {
    fav_nums:art.fav_nums,
    like_status:like_status
  }
})

// 获取详情数据
router.get('/:type/:id/detail',new Auth().m,async(ctx)=>{
  const v = await new ClassicValidator().validate(ctx)
  const art_id = v.get('path.id')
  const type = parseInt(v.get('path.type'))
  const classic = await flow.scope('bh').findOne({
    where:{
      art_id,
      type:{
        [Op.not]:400
      }
    }
  })
  if(!classic){
    throw new NotFoundException('找不到该资源')
  }
  let art = await Art.getOne(art_id,type)
  const like_status = await Favor.Userlike(ctx.auth.uid,art_id,type)
  art.setDataValue('index',classic.index)
  art.setDataValue('like_status',like_status)
  ctx.body = {
    art
  }
})


// 获取用户所喜欢的期刊列表

router.get('/favorlist',new Auth().m,async(ctx)=>{
  // 只需要传入 uid 前提需要登陆获取token
  const uid = ctx.auth.uid
  const Favors = await Favor.findAll({
    where:{
      uid,
      type:{
        [Op.not]:400
      }
    }
  })
  const list  = await Favor.getFavorList(Favors,uid)
  ctx.body=list
})
// 搜索
router.get('/book/search',async(ctx,next)=>{
const v = await new SearchValidator().validate(ctx)
const result = await book.seachBook(encodeURI(v.get('query.q')),v.get('query.start'),v.get('query.count'))
ctx.body=result

})
// 喜欢书籍数量
router.get('/book/count',new Auth().m,async(ctx,next)=>{
  const uid = ctx.auth.uid
 const count = await Favor.count({
   where:{
     uid,
     type:400
   }
 })
  ctx.body=count
  })

module.exports = router
