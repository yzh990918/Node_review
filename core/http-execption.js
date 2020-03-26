class HttpExecption extends Error {
  constructor(msg = '服务器异常', code = 400, errorCode = 10001) {
    super()
    this.msg = msg
    this.code = code
    this.errorCode = errorCode
  }
}

// 定义子类异常
class ParameterException extends HttpExecption {
  constructor(msg, code, errorCode) {
    super()
    this.msg = msg || '参数错误'
    this.code = 400
    this.errorCode = errorCode || 10000
  }
}

class Success extends HttpExecption{
  constructor(msg,code,errorCode){
    super()
    this.msg = msg|| '操作成功',
    this.code = code || 200,
    this.errorCode = errorCode || 0
  }
}

class LoginExecption extends HttpExecption{
  constructor(msg,code,errorCode){
    super()
    this.msg = msg || '获取令牌失败,请检查后登录',
    this.code = 401
    this.errorCode = 10002
  }
}

class ForbidenException extends HttpExecption{
  constructor(msg,code,errorCode){
    super()
    this.msg = msg || '禁止访问',
    this.code = 403
    this.errorCode = 10003
  }
}

class GetOpenidExecption extends HttpExecption{
  constructor(msg,code,errorCode){
    super()
    this.msg = msg || '获取openid失败',
    this.code = 403
    this.errorCode = 10004
  }
}


class LikeException extends HttpExecption{
  constructor(msg,code,errorCode){
    super()
    this.msg = msg || '点赞失败'
    this.code = 403
    this.errorCode =  10005
  }
}
module.exports = { HttpExecption, ParameterException ,Success,LoginExecption, ForbidenException,GetOpenidExecption,LikeException}
