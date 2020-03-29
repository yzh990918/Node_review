const {sequelize} = require('../../core/db')
const {Sequelize,Model,Op} = require('sequelize')
const {Favor} = require('./favor')


class Hotbook extends Model{

  static async getHotBooklist(list){
    // 获取所有的art_id
    let ids = []
    list.forEach((book)=>{
      ids.push(book.id)
    })
  const favors=  await Favor.scope('bh').findAll({
      art_id:{
        [Op.in]:ids
      },
      type:400,
    group:['art_id'],
    // 分组结果 [{art_id:1,count:},{}....]
    attributes:['art_id',[Sequelize.fn('COUNT','*'),'count']]
    })
    // 循环遍历所有的图书
    list.forEach((book)=>{
      Hotbook._setCount(book,favors)
    })
    return list
  }
  // 如果存在favor表中就把 count赋给book
  static _setCount(book,favors){
    let count = 0
    favors.forEach((favor)=>{
      if(book.id === favor.art_id){
        count = favor.get('count')
      }
    })
    book.setDataValue('count',count)
    return book
  }


}
Hotbook.init({
  index:Sequelize.INTEGER,
  image:Sequelize.STRING,
  author:Sequelize.STRING,
  title:Sequelize.STRING
},
{sequelize,
tableName:'hot_book'
})


module.exports={
  Hotbook
}
