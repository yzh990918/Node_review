const Router = require('koa-router')
const router =new Router({
  prefix:'/v1/news'
})
const axios = require('axios')
const {NewsValidator,NewsListValidator} =require('../validator/validator')
const util = require('util')
const {NotFoundException} = require('../../core/http-execption')

router.get('/latest',async(ctx,next)=>{
  // 三个参数 ext count page
  const v = await new NewsValidator().validate(ctx)
  const ext = v.get('query.ext')
  const page = v.get('query.page')
  const num = v.get('query.num')
  const url =util.format(global.config.news.URL,ext,num,page)
  const result = await axios.get(url)
  ctx.body = result.data
})
router.get('/categorylist',async(ctx,next)=>{
  ctx.body ={
    categoryList:{
      error_code:0,
      msg:'获取成功',
      data:[
        {
          id:1,
          keyword:'news',
          name:'新闻'
        },
        {
          id:2,
          keyword:'sports',
          name:'体育'
        },
        {
          id:3,
          keyword:'ent',
          name:'娱乐'
        },
        {
          id:4,
          keyword:'finance',
          name:'财经'
        },
        {
          id:5,
          keyword:'games',
          name:'游戏'
        },
        {
          id:6,
          keyword:'house',
          name:'房产'
        },
        {
          id:7,
          keyword:'auto',
          name:'汽车'
        },
        {
          id:8,
          keyword:'world',
          name:'全球'
        },
        {
          id:9,
          keyword:'edu',
          name:'教育'
        },
        {
          id:10,
          keyword:'astro',
          name:'星座'
        },

      ]
    }
  }
})

router.get('/newsList',async(ctx,next)=>{
  // 两个参数 start  count
  const v = await new NewsListValidator().validate(ctx)
  const latestId = await axios.get('https://unidemo.dcloud.net.cn/api/news?column=id%2Cpost_id%2Ctitle%2Cauthor_name%2Ccover%2Cpublished_at')
  const start = v.get('query.start') || latestId.data[0].id
  const count = v.get('query.count') || 20
  let _url_ = `https://unidemo.dcloud.net.cn/api/news?column=id%2Cpost_id%2Ctitle%2Cauthor_name%2Ccover%2Cpublished_at&minId=%s&pageSize=%s`
  const url =util.format(_url_,start,count)
  const result = await axios.get(url)
  ctx.body = result.data
})
// dcloud Id 新闻详情
router.get('/newsList/detail',async(ctx,next)=>{
  const id = ctx.request.query.id
  let _url_ = `https://unidemo.dcloud.net.cn/api/news/36kr/${id}`
  const result = await axios.get(_url_)
  ctx.body = result.data
})

// 网易云新闻列表
router.get('/Neteasenews/list',async(ctx,next)=>{
  const start = ctx.request.query.start || 0
  const num = ctx.request.query.num || 20
  let _url_ = `https://v1.alapi.cn/api/new/toutiao?start=${start}&num=${num}`
  const result = await axios.get(_url_)
  if(result === undefined){
      throw new NotFoundException('请求参数有误')
  }
  ctx.body = result.data
})


router.get('/Neteasenews/detail',async(ctx,next)=>{
  const docid = ctx.request.query.docid
  let _url_ = `https://v1.alapi.cn/api/new/detail/?docid=${docid}`
  const result = await axios.get(_url_)
  ctx.body = result.data
})

// 知乎日报
router.get('/zhihu/daily',async(ctx,next)=>{
  let _url_ = `https://v1.alapi.cn/api/zhihu/latest`
  const result = await axios.get(_url_)
  ctx.body = result.data
})

// 知乎日报详情

router.get('/zhihu/daily/detail',async(ctx,next)=>{
  const id =ctx.request.query.id
  let _url_ = `https://v1.alapi.cn/api/zhihu/news?id=${id}`
  const result = await axios.get(_url_)
  ctx.body = result.data
})

// 知乎日报短评详情
router.get('/zhihu/daily/comments',async(ctx,next)=>{
  const id =ctx.request.query.id
  let _url_ = `http://v1.alapi.cn/api/zhihu/short_comments?id=${id}`
  const result = await axios.get(_url_)
  ctx.body = result.data
})

module.exports = router
