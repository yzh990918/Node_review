// 实体模型
const { movie, music, sentence } = require('./classic')
class Art {
 static async getOne(art_id, type) {
    const find = {
      where: {
        id: art_id
      }
    }

    let result = null
    switch (type) {
      case 100:
        result = await movie.findOne(find)
        break
      case 200:
        result = await music.findOne(find)
        break
      case 300:
        result =await sentence.findOne(find)
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
