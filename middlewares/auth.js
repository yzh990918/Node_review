const basicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')
const { ForbidenException } = require('../core/http-execption')
class Auth {
  constructor(level) {
    // 定义级别
    this.level = level || 1
    Auth.USER = 8
    Auth.ADMIN = 16
    Auth.SUPER_ADMIN = 32
  }
  //!  获取属性，不是方法
  get m() {
    return async (ctx, next) => {
      // 获取node.js原生request  -- ctx.req
      const userToken = basicAuth(ctx.req)

      // 校验令牌合法性
      let errMsg = 'token令牌不合法'
      if (!userToken || !userToken.name) {
        throw new ForbidenException(errMsg)
      }
      try {
        // 获取 uid scope  jwt提供的方法校验token 返回自定义的参数  需要传入token secretKey
        var decode = jwt.verify(userToken.name, global.config.security.secretKey)
      } catch (error) {
        // 捕获异常 1.token不合法 2.token过期 过期抛出的异常:TokenExpiredError
        if (error.name == 'TokenExpiredError') {
          errMsg = 'token令牌已经过期'
        }
        throw new ForbidenException(errMsg)
      }
      if(decode.scope < this.level){
        throw new ForbidenException('权限不足')
      }
      ctx.auth = {
        uid: decode.uid,
        scope: decode.scope
      }
      await next()
    }
   
  }
  static verifyToken(token){
    try {
       jwt.verify(token, global.config.security.secretKey)
      return true
    } catch (error) {
      return false
    }
  }
}

module.exports = {
  Auth
}
