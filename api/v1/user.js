// 1.接收参数 校验
const Router = require('koa-router')
const {RegisterValidator} = require('../validator/validator')
const {User} = require('../models/user')
const {Success} = require('../../core/http-execption')

const router = new Router({
  //  定义前缀
  prefix:'/v1/user'
})

//  注册
router.post('/register',async(ctx)=>{
  //  校验完成才往下走
  const v = await new RegisterValidator().validate(ctx)
  //  获取参数 然后添加到数据库
  const user = {
    username:v.get('body.username'),
    password:v.get('body.password1'),
    email:v.get('body.email')
  }
 await User.create(user)
 throw new Success('注册账号成功')
})


module.exports = router
