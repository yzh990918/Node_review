// 实体模型
const { movie, music, sentence } = require('./classic')
class Art {
 static async getOne(art_id, type,userScope=true) {
    const find = {
      where: {
        id: art_id
      }
    }
    let result = null
    // 使用scope时 sequelize模型不能使用update更新数据 不然会报sql错误
    let scope = userScope? 'bh':null
    switch (type) {
      case 100:
        result = await movie.scope(scope).findOne(find)
        break
      case 200:
        result = await music.scope(scope).findOne(find)
        break
      case 300:
        result =await sentence.scope(scope).findOne(find)
        break
      case 400:
        break
      default:
        break
    }
    return result
  }
}


module.exports={
  Art
}
