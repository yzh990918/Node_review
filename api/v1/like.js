const Router = require('koa-router')
const router =new Router({
  prefix:'/v1'
})

const {Auth} =require('../../middlewares/auth')
const {LikeValidator} = require('../validator/validator')
const {Favor} = require('../models/favor')
const {Success} =require('../../core/http-execption')

router.post('/like',new Auth().m,async(ctx)=>{
 const v = await new LikeValidator().validate(ctx)
   const art_id = v.get('body.art_id')
   const type = v.get('body.type')
   const uid = ctx.auth.uid
   await Favor.like(uid,art_id,type)
    throw new Success('点赞成功')
})

router.post('/dislike',new Auth().m,async(ctx)=>{
  const v = await new LikeValidator().validate(ctx)
    const art_id = v.get('body.art_id')
    const type = v.get('body.type')
    const uid = ctx.auth.uid
    await Favor.dislike(uid,art_id,type)
     throw new Success('取消成功')
 })
module.exports = router
