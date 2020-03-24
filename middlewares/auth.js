const basicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')
const { ForbidenException } = require('../core/http-execption')
class Auth {
  constructor() {}
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
      ctx.auth = {
        uid: decode.uid,
        scope: decode.scope
      }
      await next()
    }
   
  }
}

module.exports = {
  Auth
}
