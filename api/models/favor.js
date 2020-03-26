const {sequelize} = require('../../core/db')
const {Sequelize,Model} =require('sequelize')
const {LikeException} =require('../../core/http-execption')
const {Art} = require('./art')
class Favor extends Model{
    
  // 两个操作 1.添加点赞或者删除点赞记录 2.实体模型中的fav_nums加一或者减一
 
  static async like(uid,art_id,type){
    const favor = await Favor.findOne({
      where:{
        uid,
        art_id,
        type
      }
    })
    // 如果用户已经点赞 就抛出异常
    if(favor){
      throw new LikeException()
      }
    // 执行事务
    return sequelize.transaction(async t =>{
      // 增加一条数据+
      await Favor.create({
        art_id,
        type,
        uid
      },{transaction:t})
      // 增加实体类fav_nums
    const art = await Art.getOne(art_id,type)
    await art.increment('fav_nums',{by:1,transaction:t})
    })
  } 
  static async dislike(uid,art_id,type){
  const favor = await Favor.findOne({
    where:{
      uid,
      art_id,
      type
    }
  })
  if(!favor){
    throw new LikeException('取消点赞失败')
    }

  return sequelize.transaction(async t=>{
    // 不是强制删除 软删除
      await favor.destroy({force:false,transaction:t})
    const art = await Art.getOne(art_id,type)
    await art.decrement('fav_nums',{by:1,transaction:t})
  })
  }
}

Favor.init({
  // 记录 用户 art_id type
  uid:Sequelize.INTEGER,
  art_id:Sequelize.STRING,
  type:Sequelize.STRING
},{sequelize,tableName:'favor'})

module.exports = {Favor}
