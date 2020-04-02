function isThisType(val){
  for(let key in this){
    if(this[key]==val){
      return true
    }
  }
  return false
}
const LoginType = {
  USER_MINI:100,
  USER_EMAIL:101,
  USER_PHONE:102,
  isThisType
}
const ArtType = {
  MOVIE:100,
  MUSIC:200,
  SENTENCE:300,
  BOOK:400,
  isThisType
}

module.exports = {
  // 开发环境
  environment: 'dev',
  LoginType,
  ArtType,
  database: {
    dbName: 'koa',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'wohenpi0918'
  },
  security:{
    // 定义的生成key的成分
    secretKey:"abcdefgH",
    //  定义令牌的时间
    expiresIn:60*60*24*30
  },
  wx:{
    appId:"wxdcb143e3cf5afacd",
    appSecret:"8a75dfade75690295ab94f82fc25c292",
    URL:"https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code"
  },
  yushu:{
    detailURL:"http://t.yushu.im/v2/book/id/%s",
    searchURL:"http://t.yushu.im/v2/book/search?q=%s&start=%s&count=%s"
  },
  news:{
    URL:"https://pacaio.match.qq.com/irs/rcd?cid=56&ext=%s&token=c786875b8e04da17b24ea5e332745e0f&num=%s&expIds=20190106A13PFT%7C20190108A04MLS&page=%s"
  }
}
