/*
 * @Author: 努力中的杨先生
 * @Date: 2020-03-21 22:33:43
 * @Descripttion: 
 * @version: 
 */
const Router = require('koa-router')
const router = new Router({
  prefix:'/v1/book'
})
const {Hotbook} = require('../models/hot_book')
const {Favor} = require('../models/favor')

const {Auth} =require('../../middlewares/auth')
const {PositiveIntegerValidator} =require('../validator/validator')
const {book} =require('../models/book')
 
// 获取热门读书 根据index获取记录的数组
router.get('/hotbooks',new Auth().m, async(ctx, next) => {
  const hotList = await Hotbook.scope('bh').findAll({
    order:[
      ['index']
    ]
  })
  const books = await Hotbook.getHotBooklist(hotList)
  ctx.body={
    books
  }
})
// 书籍点赞情况
router.get('/favor/:id',new Auth().m,async(ctx,next)=>{
  const v = await new PositiveIntegerValidator().validate(ctx,{
    art_id:'id'
  })
  const id = v.get('path.id')
  const uid =ctx.auth.uid 
  let fav_nums = await book.findOne({
    where:{
      id
    }
  })
  const status =await Favor.Userlike(uid,id,400)
  ctx.body = {
    fav_nums:fav_nums.fav_nums,
    like_status:status
  }
  })
// 图书详情
router.get('/:id',new Auth().m, async(ctx, next) => {
  const v =await new PositiveIntegerValidator().validate(ctx,{
    art_id:'id'
  })
  const id = v.get('path.id')
  const fav_nums = await book.findOne({
    id:id
  })
  const result = await book.getdetail(id)
  result.fav_nums = fav_nums.fav_nums
  ctx.body={
    book:result
  }
})
module.exports = router
