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

module.exports = {
  // 开发环境
  environment: 'dev',
  LoginType,
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
  }
}
