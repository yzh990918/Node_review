const { LinValidator, Rule } = require('../../core/lin-validator-v2')
const {User} = require('../models/user')
const {ArtType} = require('../../config/config')
class PositiveIntegerValidator extends LinValidator {
  constructor() {
    super()
    //  使用lin-validator校验规则 三个参数 规则，返回提示信息，附加参数
    //  要与路由的参数信息一一对应 数组形式
    this.art_id = [new Rule('isInt', '参数必须是正整数', { min: 1 })]
  }
}


//  注册校验
class RegisterValidator extends LinValidator {
  constructor (){
    super()
    //  四个参数 email password1 password2 nickname
    this.email = [
      new Rule('isEmail','邮箱格式不正确')
    ] 
    this.password1 = [
      new Rule('matches','密码至少六位,并且需要包含特殊字符 大写字母 小写字母 数字','/^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/')
    ]
    this.password1 = this.password2
    this.username = [
      new Rule('isLength','昵称不符合规范',{min:4,max:32})
    ]
  }

  //  自定义函数 校验重复密码输入
  validatePassword(params){
    //  Linvalidator 自定义函数可以拿到所有参数  params.body.v1 body参数
    const psw1 = params.body.password1
    const psw2 = params.body.password2
    if(psw1 !== psw2){
      throw new Error('两次密码输入不相同哦')
    }
  }
  async validateEmail(params){
    //  校验邮箱的唯一性
    const email = params.body.email
    //  sequlize查询eamil的数据 Model的操作方法都是返回Pormise
    const user = await User.findOne({
      where:{
        email:email
      }
    })
    if(user){
      throw new Error('该邮箱已存在,请重新输入')
    }

  }
  async validateUserName(params){
    const userName = params.body.username
    const user = await User.findOne({
      where:{
        username:userName
      }
    })
    if(user){
      throw new Error('用户名已存在')
    }
  }
}


class LoginValidator extends LinValidator{
  
  constructor(){
    super()
    this.account = [
      new Rule('isLength','账号不符合规范',{min:4,max:128})
    ]
    this.secret = [
      // 定义Rule为isOptional 那么该参数可为空 可不为空
      new Rule('isOptional'),
      new Rule('isLength','密码不符合规范',{min:6})
    ]
    // this.validateloginType =checkType
  }
  validateLoginType(params){
    if(!params.body.loginType){
      throw new Error('请传入登录方式')
    }
    if(!global.config.LoginType.isThisType(params.body.loginType)){
      throw new Error('type参数不合法')
    }
  }

}

class Tokenvalidator extends LinValidator{
  constructor(){
    super()
    this.token = [
      new Rule('isLength','token不合法',{min:1})
    ]
  }
}
 function checkType(params){
  let type = params.body.type || params.path.type
  if(!type){
    throw new Error('type是必填参数')
  }
  // 通过 params.path.type 或者 params.query.type 拿到的参数默认是个字符串需要转型 但这里不能对路由里validate达到的参数进行更改 强行更改 this.parsed.path.type = type
  type = parseInt(type)
  if(!ArtType.isThisType(type)){
    throw new Error('请填写正确的type类型')
  }
}
class LikeValidator extends PositiveIntegerValidator{
  constructor(){
    super()
    this.validateType = checkType
  }
}

class IndexValidator extends LinValidator {
  constructor(){
    super()
   this.index = [
     new Rule('isInt','必须是正整数',{min:1})
   ]
  }
}

class ClassicValidator extends LinValidator{
  constructor(){
    super()
    this.id = [
      new Rule('isInt','必须是正整数',{min:1})
    ]
    this.validateType = checkType 
  }
}

class SearchValidator extends LinValidator {
  constructor(){
    super()
    this.q = [
      new Rule('isLength','搜索关键词不能为空',{min:1})
    ]
    this.start= [
      new Rule('isInt','',{
        min:0,
        max:60000
      }),
      new Rule('isOptional',0)
    ]
    this.count = [
      new Rule('isInt','',{
        min:1,
        max:20
      }),
      new Rule('isOptional',20)
    ]
  }
}
module.exports = { PositiveIntegerValidator ,RegisterValidator, LoginValidator, Tokenvalidator, LikeValidator, IndexValidator, ClassicValidator, SearchValidator}
