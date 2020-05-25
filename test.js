const axios = require('axios')
function insertMany(collection,arr){
  return new Promise((resolve,reject)=>{
    // 连接数据库
    var MongClient = require('mongodb').MongoClient
    var url="mongodb://localhost:27017/"
    MongClient.connect(url,{useNewUrlParser:true,useUnifiedTopology:true},(error,db)=>{
      // 成功连接回调
      if(error){
        throw error
      }
      // 获取数据库对象 并插入集合
      var dbo = db.db("lol")
      dbo.collection(collection).insertMany(arr,(err,res)=>{
        if(err){
          reject(err)
        }
        console.log(res.insertedCount)
        db.close()
        resolve()
      })
    })
  })
}

async function getHeroList(){
  let result = await axios.get('https://game.gtimg.cn/images/lol/act/img/js/heroList/hero_list.js?v=28')
  await insertMany("heroList",result.data.hero)
  return result.data.hero
}

getHeroList()

