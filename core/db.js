const Sequelize = require('sequelize')
const {
  dbName,
  host,
  port,
  user,
  password
} = require('../config/config').database

// sequlize配置前三个参数 数据库名 用户名 密码 再加上配置项
const sequelize = new Sequelize(dbName, user, password, {
  // 数据库类型
  dialect: 'mysql',
  host,
  port,
  // 是否在命令行打印出sql
  logging: true,
  // 显示北京时间
  timezone: '+08:00',
  define: {
    // 加入创建时间 更新 updatedAt, createdAt
    timestamps: true,
    // 必须和timestamps同时使用 增加一个 deletedAt 标识当前时间
    paranoid: true,
    // 重命名 时间戳字段
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    // 不使用驼峰式命令规则，这样会在使用下划线分隔
    // 这样 updatedAt 的字段名会是 updated_at
    underscored: true,
    scopes:{
      // 全局的预定义 sql语句
      bh:{
        // 全局的查询的返回字段不包括这三个字段
        attributes:{
          exclude:['created_at','deleted_at','updated_at','deletedAt']
        }
      }
    }
  }
})
// 同步Model到数据库
sequelize.sync({
  //  强制删除表 然后覆盖
  force: false
})
module.exports = { sequelize }
