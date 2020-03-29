const { sequelize } = require('../../core/db')
const { Sequelize, Model ,Op} = require('sequelize')
const { LikeException } = require('../../core/http-execption')
const { Art } = require('./art')
const { flatten } = require('lodash')
const { movie, music, sentence } = require('./classic')
class Favor extends Model {
  // 两个操作 1.添加点赞或者删除点赞记录 2.实体模型中的fav_nums加一或者减一

  static async like(uid, art_id, type) {
    const favor = await Favor.findOne({
      where: {
        uid,
        art_id,
        type
      }
    })
    // 如果用户已经点赞 就抛出异常
    if (favor) {
      throw new LikeException()
    }
    // 执行事务
    return sequelize.transaction(async t => {
      // 增加一条数据+
      await Favor.create(
        {
          art_id,
          type,
          uid
        },
        { transaction: t }
      )
      // 增加实体类fav_nums
      const art = await Art.getOne(art_id, type,false)
      await art.increment('fav_nums', { by: 1, transaction: t })
    })
  }
  static async dislike(uid, art_id, type) {
    const favor = await Favor.findOne({
      where: {
        uid,
        art_id,
        type
      }
    })
    if (!favor) {
      throw new LikeException('取消点赞失败')
    }

    return sequelize.transaction(async t => {
      // 不是强制删除 软删除
      await favor.destroy({ force: true, transaction: t })
      const art = await Art.getOne(art_id, type,false)
      await art.decrement('fav_nums', { by: 1, transaction: t })
    })
  }
  static async Userlike(uid, art_id, type) {
    // 返回用户是否喜欢这个art
    const favor = await Favor.findOne({
      where: {
        uid,
        art_id,
        type:type
      }
    })
    // 如果存在点赞 就返回true
    return !!favor
  }
  static async getFavorList(list,uid) {
    // 最终返回结果 [[100:],[200:],[300:]]
    let FavorListObj = {
      100: [],
      200: [],
      300: []
    }
    // 分别向不同的type中添加 ids  现在的obj {100:[1,2,3],200:[1,2,3]..}
    list.forEach(item => {
      FavorListObj[item.type].push(item.art_id)
    })
    let ret = []
    for (let item in FavorListObj) {
      // 拿到每个key :item-type  拿到每个key下的ids FavorListobj[item]
      //进行in查询
      let itemX = parseInt(item)
      if (FavorListObj[item].length === 0) {
        continue
      }
      ret.push(await Favor._getlistByType(itemX, FavorListObj[item],uid))
    }
    // 需要借助loadsh 打散二维数组为一维数组
    return flatten(ret)
  }
  static async _getlistByType(type, ids,uid) {
    const find = {
      where: {
        id: {
          [Op.in]: ids
        }
      }
    }
    let result = []
    switch (type) {
      case 100:
        result= await movie.scope('bh').findAll(find)
        break
      case 200:
        result = await music.scope('bh').findAll(find)
        break
      case 300:
        result = await sentence.scope('bh').findAll(find)
        break
      default:
        break
    }
    // result 返回实体数组 [[],[],[]]
    result.forEach(async(item)=>{
      let like_status =await Favor.Userlike(uid,item.id,item.type)
      item.setDataValue('like_status',like_status)
    })
    return result
  }
}

Favor.init(
  {
    // 记录 用户 art_id type
    uid: Sequelize.INTEGER,
    art_id: Sequelize.STRING,
    type: Sequelize.STRING
  },
  { sequelize, tableName: 'favor' }
)

module.exports = { Favor }
