const { sequelize } = require('../../core/db.js')
const { Sequelize, Model } = require('sequelize')

// 共同字段
const classicFields = {
  content: Sequelize.STRING,
  image: Sequelize.STRING,
  pubdate: Sequelize.DATEONLY,
  title: Sequelize.STRING,
  fav_nums: Sequelize.INTEGER,
  type: Sequelize.INTEGER
}

class movie extends Model {}

movie.init(classicFields, {
  sequelize,
  tableName: 'movie'
})

class sentence extends Model {}

sentence.init(classicFields, {
  sequelize,
  tableName: 'sentence'
})

class music extends Model {}

const musicField = Object.assign({ songUrl: Sequelize.STRING }, classicFields)
music.init(musicField, {
  sequelize,
  tableName: 'music'
})

module.exports = {
  movie,
  sentence,
  music
}
