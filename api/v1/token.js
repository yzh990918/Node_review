const Router = require('koa-router')
const router = new Router({
  prefix: '/v1/user'
})
const bcrypt = require('bcryptjs')
const { generateToken } = require('../../core/util')
const { LoginValidator } = require('../validator/validator')
const { LoginExecption } = require('../../core/http-execption')
const { LoginType } = require('../../config/config')
const { User } = require('../models/user')
const {Auth} = require('../../middlewares/auth')
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
module.exports = router
