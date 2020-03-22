class HttpExecption extends Error{
  constructor(msg="服务器异常",code=400,errorCode=10001){
    super()
    this.msg = msg
    this.code =code
    this.errorCode = errorCode
  }
}

// 定义子类异常
class ParameterException extends HttpExecption{
  constructor(msg,code,errorCode){
    super()
    this.msg = msg || '参数错误'
    this.code = 400
    this.errorCode = errorCode || 10000 
  }

}
module.exports = {HttpExecption,ParameterException}
  

