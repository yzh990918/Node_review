const bcryptjs = require('bcryptjs')
const { sequelize } = require('../../core/db')
//  导入sequelize模型 定义数据表结构 模型层
const { Sequelize, Model } = require('sequelize')
const {LoginExecption} = require('../../core/http-execption')


class User extends Model {
      static async getOpenIDUser(openid){
        const user = await User.findOne({
          where:{
            openid:openid
          }
        })
        return user
      }
      static async registerOpenID(openid){
       return await User.create({
         openid:openid
       })
      }
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
