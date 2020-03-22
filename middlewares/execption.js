const {HttpExecption} = require('../core/http-execption')
// 定义全局异常中间件
const eception = async(ctx,next)=>{
  try {
    await next()
  } catch (error) {
    if(global.config.environment === 'dev'){
      throw error
    }
    if(error instanceof HttpExecption){
      ctx.body={
        msg:error.msg,
        error_code:error.errorCode,
        request:`${ctx.method} ${ctx.path}`
      }
      ctx.status = error.code
    }else{
      ctx.body = {
        msg:"未知异常发生",
        erro_code:999,
        request:`${ctx.method} ${ctx.path}`
      }
      ctx.status = 500
    }
  }
}

module.exports = eception
