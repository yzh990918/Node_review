const {sequelize} = require('../../core/db')
const {Sequelize,Model} = require('sequelize')
const util =require('util')
const axios = require('axios')

class book extends Model{
  static async getdetail(id){
    const url = util.format(global.config.yushu.detailURL,id)
    let result = await axios.get(url)
    return result.data
  }
  static async seachBook(q,start,count){
    const url = util.format(global.config.yushu.searchURL,q,start,count)
    const result = await axios.get(url)
    return result.data
  }

}
book.init({id:{type:Sequelize.INTEGER,primaryKey:true},fav_nums:{type:Sequelize.INTEGER,default:0}},{sequelize,tableName:'book'})

module.exports = {
  book
}
