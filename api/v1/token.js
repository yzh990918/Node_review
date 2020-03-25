const Router = require('koa-router')
const router = new Router({
  prefix: '/v1/user'
})
const bcrypt = require('bcryptjs')
const { generateToken } = require('../../core/util')
const { LoginValidator, Tokenvalidator } = require('../validator/validator')
const { LoginExecption } = require('../../core/http-execption')
const { LoginType } = require('../../config/config')
const { User } = require('../models/user')
const {Auth} = require('../../middlewares/auth')
const {WxManager} =require('../services/wx')
router.post('/token', async ctx => {
  const v = await new LoginValidator().validate(ctx)
  //  校验登陆账号和密码
  const account = v.get('body.account')
  const secret = v.get('body.secret')
  const type = v.get('body.loginType')
  let token
  switch (type) {
    case LoginType.USER_EMAIL:
      token = await emailLogin(account, secret)
      break
    case LoginType.USER_MINI:
      token = await WxManager.codeTotoken(account)
      break
    default:
      throw new LoginExecption('类型异常')
      break
  }
  ctx.body = {
    token
  }
})

async function emailLogin(account, secret) {
  // const user = await User.vertifyEmailLogin(account,secret)
  const user = await vertifyEmail(account, secret)
  return (token = generateToken(user.id, Auth.USER))
}
async function vertifyEmail(account, secret) {
  const user = await User.findOne({
    where: {
      email: account
    }
  })
  if (!user) {
    throw new LoginExecption('账号不存在')
  }
  if (!bcrypt.compareSync(secret, user.password)) {
    throw new LoginExecption('密码输入错误')
  }
  return user
}

// 校验 storage拿到的token是否合法
router.post('/vertify',async(ctx)=>{
  const v = await new Tokenvalidator().validate(ctx)
  const token = v.get('body.token')
  const result =Auth.verifyToken(token)
  ctx.body= {
    result:result
  }

})
module.exports = router
