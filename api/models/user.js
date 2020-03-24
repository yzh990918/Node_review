const bcryptjs = require('bcryptjs')
const { sequelize } = require('../../core/db')
//  导入sequelize模型 定义数据表结构 模型层
const { Sequelize, Model } = require('sequelize')
const {LoginExecption} = require('../../core/http-execption')


class User extends Model {
      // // 校验邮箱登陆方法
      // static async vertifyEmailLogin(account,secret){
      //   const user = await User.findOne({
      //     where:{
      //       email:account
      //     }
      //   })
      //   if(!user){
      //     throw new LoginExecption('邮箱不存在')
      //   }
      //   //  比较密码与原始密码
      //   const corret = bcryptjs.compareSync(secret,user.password)
      //   if(corret === false){
      //     throw new LoginExecption('密码不正确,授权失败')
      //   }
      //   return user
      // }
}

User.init(
  {
    // 主键: 不能为空 不能重复
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      // 自动增长 id编号
      autoIncrement: true
    },
    username: { type: Sequelize.STRING, unique: true },
    password: {
      type:Sequelize.STRING,
      // 加密明文
      set(val){
          const sault = bcryptjs.genSaltSync(10)
          const pwd = bcryptjs.hashSync(val,sault)
          this.setDataValue('password',pwd)
      }
    },
    email: {
      type: Sequelize.STRING(128),
      unique: true
    },
    openid: {
      // 最大字符长度 64
      type: Sequelize.STRING(64),
      unique: true
    }
  },
  {
    sequelize,
    tableName: 'user'
  }
)

module.exports = {
  User
}
