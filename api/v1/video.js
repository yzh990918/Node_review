const Router = require('koa-router')
const router =new Router({
  prefix:'/v1/video'
})
const axios = require('axios')

// 只做接口转发

// 开眼视频app首页tab
router.get('/kaiyan/tab',async(ctx,next)=>{
  const url = 'https://api.apiopen.top//videoHomeTab'
  const result = await axios.get(url)
  ctx.body = result.data
})

// 开眼视频app 推荐视频
router.get('/kaiyan/recommend',async(ctx,next)=>{
  // id 只能取偶数增长 建议从10000开始
  const id  = ctx.query.id
  if(id === null || undefined){
    throw new Error('参数错误')
  }
  const url = `https://api.apiopen.top/videoRecommend/?id=${id}`
  const result = await axios.get(url)
  ctx.body = result.data
})

// 随意一首歌曲 评论
router.get('/randomMusic',async(ctx,next)=>{
  const url = 'https://v1.alapi.cn/api/comment'
  const result = await axios.get(url)
  ctx.body = result.data
})


router.get('/weiboHot',async(ctx,next)=>{
  const url = 'https://v1.alapi.cn/api/new/wbtop'
  const result = await axios.get(url)
  ctx.body = result.data
})

module.exports = router
