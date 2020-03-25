const { sequelize } = require('../../core/db.js')
const { Sequelize, Model } = require('sequelize')


class flow extends Model {}

flow.init({
  art_id:Sequelize.STRING,
  index:Sequelize.STRING,
  type:Sequelize.STRING
}, {
  sequelize,
  tableName: 'flow'
})

module.exports ={
  flow
}
