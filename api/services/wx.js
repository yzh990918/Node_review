
const util = require('util')
const axios  =require('axios')
const {GetOpenidExecption} = require('../../core/http-execption')
const {generateToken} =require('../../core/util')
const {User} = require('../models/user.js')
const {Auth} = require('../../middlewares/auth')
// 微信登录业务代码
class WxManager {
  static async codeTotoken(code) {
    // url 需要通过wx.login获取code 然后传入三个参数调用接口 获取openId 
    // format 传入的参数取代占位符 相当于拼接字符串
    const url = util.format(global.config.wx.URL,global.config.wx.appId,global.config.wx.appSecret,code)
    const result = await axios.get(url)
    // 异常处理
    if(result.status !== 200){
      throw new GetOpenidExecption()
    }
    // 这里会有坑 正确返回值中没有errcode字段
    if(result.data.errcode){
      throw new GetOpenidExecption('获取openID失败'+ result.data.errcode)
    }
    // 获取成功 就返回一个token 并且查询到无此人时插入数据
    let user =await User.getOpenIDUser(result.data.openid)
    if(!user){
     user= await User.registerOpenID(result.data.openid)
    }
    let token = generateToken(user.id,Auth.USER)
    return token
  }
}

module.exports={
  WxManager
}
