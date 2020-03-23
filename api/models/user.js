const {sequelize} = require('../../core/db')
//  导入sequelize模型 定义数据表结构 模型层
const {Sequelize,Model} = require('sequelize')


class User extends Model {

}

User.init({
  // 主键: 不能为空 不能重复
  id:{
    type:Sequelize.INTEGER,
    primaryKey:true,
    // 自动增长 id编号
    autoIncrement:true
  },
  username:Sequelize.STRING,
  password:Sequelize.STRING,
  email:Sequelize.STRING,
  openid:{
    // 最大字符长度 64
    type:Sequelize.STRING(64),
    unique:true
  }
},{
  sequelize,
  tableName:'user'
})
