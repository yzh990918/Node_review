
<p>
<img src="https://user-gold-cdn.xitu.io/2019/12/23/16f3031b3afaad3f?imageView2/1/w/1304/h/734/q/85/format/webp/interlace/1" />
</p>
<h1 align="center">Welcome to Best Node Practice </h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
    <img src="https://img.shields.io/badge/koa-2.7.0-blue.svg" />
  <img src="https://img.shields.io/badge/jsonwebtoken-8.4.0-blue.svg" />
    <img src="https://img.shields.io/badge/validator-10.11.0-blue.svg" />
  <img src="https://img.shields.io/badge/node-%3E%3D%206.0.0-blue.svg" />
  <img src="https://img.shields.io/badge/npm-%3E%3D%203.0.0-blue.svg" />
  <img src="https://img.shields.io/badge/axios-0.18.0-blue.svg" />

  <a href="https://github.com/251205668/Node_review/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg" />
  </a>
</p>

> Koa framework foundation for node.js, a tutorial for building the restfuAPI

## Getting started

```sh
# clone the Project
git clone https://github.com/251205668/Node_review.git

# enter the project directory
cd Node_review

# install dependency
npm install

# develop
npm run dev

# test
Listening the 3000 port

```
## Features

- middlewares
  - Global exception handling
  - JWT token validation
  - Token does not sense refresh
- classic journals
  - Get the latest journals
  - Get the next issue of the journal
  - Get the last issue of the journal
  - For details of a particular issue
  - Get the thumb up information
  - Get the journals I liked
- Book
  - Get a list of popular books
  - Get book reviews
  - Get the book thumb up information
  - A new comment
  - Get hot search keywords
  - Books retrieval
  - Get book details
- favor
  - give a like
  - Cancel the thumb up

## How It work

### Basic

Write the most basic code for an API

```js
const koa = require('koa')
const Router =require('koa-router')

const router = new Router()

const app = new koa()

router.get('/classic/latest',(ctx,next)=>{
  ctx.body ={key:"classic"}
})
// router.routes() 注册中间件
app.use(router.routes())
app.listen(3000,()=>{
  console.log('http监听端口3000')
})
```

#### middleware
The middleware sends functions called by HTTP, one instance can define multiple middleware, and the middleware call always returns `promise`

`app.use`register the middleware。`ctx`contents，`next`next middleware

```js
// 中间件--就是函数
app.use((ctx,next)=>{
  // ctx 上下文
  console.log('七月')
  next()
})
app.use((ctx,next)=>{
  console.log('八月')
})
```

Passing parameters
By mounting to CTX, the onion model is first guaranteed

```js
app.use(async(ctx,next)=>{
    await next()
    console.log(ctx,r)
})

app.use(async(ctx,next)=>{
    ctx.r = await axios.get('www.baidu.com').data
    await next()
})

// 打印出dom结构，实现了传参
```

#### The onion model

Execute on fun1 and then execute the middleware function under fun1.You can determine whether the function is fully executed, with the middleware function as the dividing line
![](https://image.yangxiansheng.top/img/QQ截图20200321195714.png?imagelist)

Simple example:

```js
app.use(async(ctx,next)=>{
    fun1()
    await next()
    funt1下()
})

app.use(async(ctx,next)=>{
    funt2()
})
```

use async,await to let `promise` sequentially，Call to order:
fun1()TOP ====> fun2() ====> fun1 Bottom

#### async await

await Features:

- evaluation
  await 理解为计算`promise`的值,使用await使用一定要在function前加上`async`，也可以对表达式求值。使用async,**await一定可以使中间件保持洋葱模型**。

```js
app.use(async(ctx,next)=>{
    console.log(1)
    const a = await next()
    console.log(2)
})

app.use(async(ctx,next)=>{
    console.log(3)
})

// 1 3 2
```

- Blocking threads
    A common asynchronous call: 'to the resource read file operation database send http`    

```js
//默认异步调用

app.use((ctx,next)=>{
    console.log(1)
    axios.get('www.baidu.com').then((res)=>{
          const a = res
    })
    console.log(a)
    console.log(2)
})

// 由于是异步请求 打印结果 1 2 res

使用await阻塞线程之后，异步同步化
app.use(async(ctx,next)=>{
    console.log(1)
    const a = await axios.get('www.baidu.com')
    console.log(a)
    console.log(2)
})
// 打印 1 res 2
```
> Limited energy, not translated for the time being
#### 路由

初级路由判断 `ctx.path`返回路由,`ctx.method`返回调用方法，`ctx.body`定义返回内容

```js
app.use(async(ctx,next)=>{
    if(ctx.path ==='/clasic/latest' && ctx.method ==='GET'){
        ctx.body =  {key:"clasic"}
    }
})
```

使用`koa-router`方法

```js
const router = new route()

router.get('/',(ctx,next)=>{
    ...
})

app.use(router.routes())
```

nodemon 自动重启node服务
全局启动`nodemon app.js`

**一键导入module `require-directory`轮子**

```js

const requireDirectory = reuire('require-directory')

requreDirectory(module,'./api/v1',visit:function)

function whenExportModule(obj){
    if(obj instanceof Router){
        app.use(obj.routes())
    }
}
```

#### 改造 路由

创建 core.js

```js
const Router  = require('koa-router')
const requireDirectory = require('require-dicectory')

// 导入全部模块前判断 是否是Router的对象 
class InitManger{
    static initcore(app){
        InitManager.app = app
        InitManager.InitLoadRouters()
    }
    static InitLoadRouters(){
    const path = `${process.cwd()}/api/v1`
        requireDirectory(module,path,{
            visit:whenLoadrouters
        })
        function whenLoadrouters(obj){
            if(obj instanceof Router){
              InitManger.app.use(obj.routes())
            }
        }
    }
}
```

app.js引入

```js
const IniManager = require('core.js')

InitManager.initcore(app)
app.listen(3000)
```



#### 校验处理

###### 获取参数

假设访问的路由地址为`localhost:3000/v1/3/classic/latest?password=123` header:`token:1111` ,body:`{"key":"localhost"}`

```js
router.get('/v1/:id/classic/latest',(ctx,next)=>{
    // 获取url参数
    const params = ctx.params
    // 获取query 
    const query = ctx.request.query
    // 获取token
    const query = ctx.request.header
    // 获取访问时内容
    const body = ctx.request.body
    ctx.body={key:"classic"}
})
```

###### 异常处理

设置全局返回的状态码   **异常分为：`已知异常`   `未知异常`**

```js
message
error_code
request_url
HTTP status code 2xx 4xx 5xx
常见Http状态码

200 'ok'
400 'params error'
404 'Not found'
403 'forbidden'
502 'bad gateway' 路径错误
500 '服务器异常'
504 '服务器超时'
```



**全局异常处理**

定义一个`execption`类继承`Error`,然后抛出异常时实例化，传递参数，打印全局异常返回json

- 创建Http-execption.js

   ```js
   class Httpexecption extends Errror{
      // 定义构造函数
       constructor(msg="服务器异常",code=400,errorCode=10001){
           super()
           this.msg = msg
           this.code = code
           this.errorCode = 10001
       }
   }
   
   class Paramexecption extends Httpexecption{
       constructor(msg,code,errCode){
           super()
           this.msg = msg || '参数错误'
           this.code = 400
           this.errorCode = 10000
       }
       
   }
   module.exports = {
       Httpexecption,
       Paramexecption
   }
   ```

- 创建全局异常处理中间件

   ```js
   const {Httpexecption} = require('Http-execption')
   
   const execption = async(ctx,next){
       try{
           await next()
       }catch(error){
           if(error instanceof Httpexecption){
               ctx.body = {
                   msg: error.msg,
                   error_code:error.errorCode,
                   request:`${ctx.method} ${ctx.path}`
               }
           }
           
       }
   }
   
   module.exports=execption  // app.js注册该中间件
   ```

- 在定义路由时抛出异常

   ```js
   const {Paramexecption} = require('Http-execption')
   router.get('/latest',(ctx,next)=>{
       const query = ctx.request.query
       if(!query){
           const error = new Paramexecption()
           thorw error
      }
   })
   ```

- 未知异常

   ```js
   else{
         ctx.body = {
           msg:"未知异常发生",
           erro_code:999,
           request:`${ctx.method} ${ctx.path}`
         }
         ctx.status = 500
       }
     }
   ```

###### 参数校验

使用`Lin-validator`进行参数校验 使用前必须定义好全局抛出参数异常的 `Paramexecption`,然后引入`util.js`

**第一步 创建校验器类**

```js
const {Linvalidator,Rule} from 'Lin-validator.js'

// 校验正整数 
class PositiveIntegerValidator extends Linvalidator{
    constructor(){
       super()
    //  使用lin-validator校验规则 三个参数 规则，返回提示信息，附加参数
    //  要与路由的参数信息一一对应 数组形式
    this.id = [ 
      new Rule('isInt','参数必须是正整数',{min:1})
    ]
  }
    }
}
module.exports = {PositiveIntegerValidator}
```

**第二步 引用校验器进行校验** (调用validate方法)

```js
const {PositiveIntegerValidator}  = require('validator.js')

router.get('/classic/:id/latest',(ctx,next)=>{
    const v = new PositiveIntegerValidator().validate(ctx)
})
```

**使用校验器获参数 ** get方法

```js
const param = ctx.params
const v =new PositiveIntegerValidator().validate(ctx)
const id = v.get('param.id')  // 自动将id 转换为整形
// 如果不想转换  
const id = v.get('param.id',parsed:false)
```



<h4>配置开发环境的异常抛出</h4>
由于我们捕获到的异常都去做了全局异常处理，导致某些异常无法判断， 所以定义config来配置开发环境

```js
module.exports={
    enviorment:"dev"
}
```

在全局异常中间件,判断是否是开发环境,然后抛出异常

```js
if(global.config.enviorment === 'dev'){
    throw error
}
```


#### sql复习

###### 创建数据库

```sql
CREATE DATABASE 数据库名
```

###### 删除数据库

```sql
DROP DATABASE 数据库名
```

###### 创建表

约束

```sql
1. 非空约束  NOT NULL
2. 默认值约束  DEFAULT '男'
3. 唯一性约束 UNIQUE
3. 主键约束 PRIMARY KEY
```



```sql
create table 表名(
字段名 类型(长度) [约束],
    ...
)
```

常见类型

![](https://image.yangxiansheng.top/img/1585018919602.png?imagelist)



###### 删除表

```sql
DROP TABLE 表名;
```

###### 查看表结构

```sql
DESC 表名
```

###### 修改表结构

```sql
修改列名
Alter table 表名  change  列名  新列名 类型;

修改列类型
Alter table 表名  modify  列名  新类型;
```

###### 增

```sql
insert into 表名(字段1，字段2...)values(值1,值2...)
```

其他方式

```sql
insert into 表名(字段1,字段2) values(值1,值2),(值1,值2);     //插入多条数据【MYSQL】
insert into 表名 values(值1,值2);                    //针对全表所有字段进行插入操作
insert into 表名(字段) select 字段 from 表2;         //查询结果插入
insert into 表名 select 字段 from 表2;               //查询结果，全表插入
```

###### 删

```sql
delete from 表 where 条件
```

###### 改

```sql
update 表 set 字段=值 where 条件
例: update user set username=7yue where id =1;
```

###### 查

查询表中全部内容

```sql
select * from 表名
```

查询指定列信息

```sql
select 列1 from 表名
```

条件查询

```sql
select 列.. from 表名 where 条件
```

条件运算符  逻辑运算符

```sql
=  >  >=  <  <=  and  &&  or  not
```

范围查询

```sql
where 列 between 条件1  and 条件2;          //列在这个区间的值

where 列 not between 条件1 and 条件2;    //不在这个区间

where !( 列 between 条件1 and 条件2 );     //同样表示不在这个区间
```

空值查询

```sql
where 列 is null;  //查询列中值为null的数据
```

模糊查询

```sql
where 列 like '%0';   //表示以0结尾
where 列 like  '0%';   //表示以0开头
where 列 like  '%0%';   //表示数据中包含0
```

排序

```sql
where 条件 order by 列 [asc/desc]
```

多表查询

```sql
select * from 表1,表2  where 表1.字段=表2.字段;  //隐式内连接,使用where条件消除笛卡尔积

select * from 表1 [inner] join 表2 on 表1.字段=表2.字段;  //显式内连接,如果是多张表，则一直在join..on后依次添加join..on即可,inner关键字可被省略
```





#### sequlize(模型导入数据库)

###### 初始化配置 

> 以上配置都可以参考[sequelize文档]( https://sequelize.org/v5/index.html ) 或者[中文文档]( https://itbilu.com/nodejs/npm/V1PExztfb.html )

第一步，定义数据库配置

config.js

```js
module.exports = {
    database:{
        // 数据库名 主机号 端口 用户名 密码
        dbName:"koa",
        host:"localhost",
        port:3306,
        user:"root",
        password:"wohenpi0918"
        
    }
}
```

第二步，配置`sequelize`  更多配置参考 
[API文档](https://itbilu.com/nodejs/npm/V1PExztfb.html)

```js
const Sequelize = require('sequelize')
const {dbName,host,port,user,password} = require('config.js')

// 参数: 数据库名 用户名 密码 配置具体 
const sequlize = new Sequelize(dbName,user,password.{
 	// 数据库类型
      dialect:'mysql',
      host,
      port,
    // 是否在命令行打印出sql
      logging:true,
    // 显示北京时间
  	  timezone:'+08:00',
      define:{
    // 加入创建时间 更新 updatedAt, createdAt
      timestamps:true,
    // 必须和timestamps同时使用 增加一个 deletedAt 标识当前时间
      paranoid:true,
    // 重命名 时间戳字段
       createdAt:'created_at',
       updatedAt:'updated_at',
       deletedAt:'deleted_at',
    // 不使用驼峰式命令规则，这样会在使用下划线分隔
    // 这样 updatedAt 的字段名会是 updated_at
       underscored: true,
  }
      })
      
   // 同步模型到数据库中
   sequelize.sync({
       // 是否强制更新 删除后直接覆盖数据表
       force: false,
   })
module.exports = {sequelize}
```

第三步,定义模型层

model下创建user.js  更多定义方法 参考[数据类型]( https://sequelize.org/v5/manual/data-types.html )

```js
const {sequelize} =require('db.js')
const {Sequelize,Model} = require('sequelize')

class User extends Model{
    
}
// 定义模型层
User.init({
  // 主键: 不能为空 不能重复
  id:{
    type:Sequelize.INTEGER,
    primaryKey:true,
    // 自动增长 id编号
    autoIncrement:true
  },
  username:{type:Sequelize.STRING,unique:true},
  password:Sequelize.STRING,
  email:{type:Sequelize.STRING,unique:true},
  openid:{
    // 最大字符长度 64
    type:Sequelize.STRING(64),
    unique:true
  }
},{
  sequelize,
   // 自定义表名  默认会以模型名为表名
  tableName:'user'
})
```

启动项目, sequelize会创建一张`user`表

![](https://image.yangxiansheng.top/img/1584979877301.png?imagelist)



###### sequelize相关API

> sequelize大多数查询的API都是返回的pormise对象,所以定义模型方法时加上 `async`和`await`

```js
1. 定义模型  class A extends Model{}  A.unit({},{sequelize,tableName:"name"})
2. 访问字段和设置字段值  get(){ let title = this.getDataValue('title')..}  set(val){this.setDataValue('index',value)}

3. 验证Validations
username:{type:Sequelize.STRING,validate:{len:[2,10] ....}}

----------
Model类API

1. removeAttribute([attribute]) 删除一个字段属性(列)

2. sync() 将当前模型同步到数据库  可以配置{force:true} 强制覆盖,每次同步都会先删除之前的表

3. drop() 删除数据库的表

4. getTableName() 获取表名，可以指定schema

5. scope() 定义限制范围

6. findOne 查询单条数据  await ModelNmae.findOne({
    where:{
        'index':value
    }
})

7. findAll 查询多条数据  await ModelName.findAll({
    where:{
        attr1:value,
        attr2:value
    }
})   
这里可以使用到 大于,小于等`$gt` `lte`  `$or`
Model.findAll({
  where: {
    attr1: {
      $gt: 50
    },
    attr2: {
      $lte: 45
    },
    attr3: {
      $in: [1,2,3]
    },
    attr4: {
      $ne: 5
    }
  }
})
// WHERE attr1 > 50 AND attr2 <= 45 AND attr3 IN (1,2,3) AND attr4 != 5


8. findById()  通过主键id查询单个实例

9. count()  统计数量

10. findAndCount  分页查询

11. create() 创建实例

12. max()  min()  sum()

13. upsert 创建或更新

14. className.transition(async (t)=>{
    ... 
})  
 创建事务
 Modle类.transcation(async t =>{
     await Favor.create({
         uid,art_id,type
     },{transcation:t})
     ...更多操作
 })

15. destory 删除记录

16. restore 恢复记录

17 自增自减  increment decrement
user.increment(['age', 'number'], {by:2}).then(function(user){
  console.log('success');
})

```



#### 注册

> 首先定义好模型 然后编写校验器 密码用盐加密，处理好异常

###### 编写校验器  

用户名: 用户名长度规范 唯一性规范

密码: 正则表达式规范

邮箱:  邮箱规范 唯一性规范

```js
const {User} = require('user.js')

class RegisterValidator extends Linvalidator{
    constructor(){
        // 用户名
        this.username= [
            new Rule('isLength','用户名不符合规范',{min:4,max:32})
        ]
        // 密码
        this.password1 =  [
            new Rule('matches','密码必须包含特殊字符,字母,数字并且超过六位'，'/^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/')
        ]
        // 校验规则相同
        this.password1 = this.password2
        this.email = [
            new Rule('isEmail','邮箱不符合规范')
        ]
    }
    //自定义方法 校验用户和邮箱的唯一性 必须以validate开头
    validateUserName(params){
        // 通过params.body 拿到body参数
        const username = params.body.username
        // sequelize条件查询
        const user = User.finOne({
            where:{
                username:username
            }
        })
    }
    validateEmail(params){
        const email = params.body.email
        const user = USer.findOne({
            where:{
                email:email
            }
        })
    }
}
```

###### 编写注册API  （标准流程）

```js
const Router = require('koa-router')
const router = new Router({
    // 添加前缀
    prefix:'/v1/user'
})

router.post('/register',async(ctx)=>{
    // 守门员 校验参数 只有当通过校验器才能插入模型数据
    const v = await new RegisterValidator().validate(ctx)
    // 获取通过校验的参数
    const params = {
        username:v.get('body.username'),
        password:v.get('body.password1'),
        email:v.get('body.email')
    }
    // 插入数据库  模型.create(参数列表)
	await User.create(user)
    
})

```

###### 明文加密

```js
const bcryptjs = require('bcryptjs')
//定义密码模型时加密
User.init({
    password:{
        type:Sequeize.STRING,
        set(val){
            // 取盐 赋盐
            const sault = bcryptjs.getSaltSync(10)
            const pwd = bcryptjs.hashSync(val,sault)
            // 将盐赋值
            this.setDataValue('password',pwd)
        }
    }
})
```

#### 登录

> 定义好登陆的方式 然后编写相关的校验器，

###### 准备工作

首先定义好登录的方式 ,模仿枚举方式

```js
// 定义一个判断方法 ,判断是否在这几个类型中
function isInType(val){
    for(let key in this){
        if(this[key] === val){
            return true
        }
    }
    return false
}
const LoginType = {
    //  邮箱 手机号 小程序登录
    USER_EMAIL:100,
    USER_PHONE:101,
    USER_MINI:102,
    isInType
}

module.exports = {
    LoginType
}
```

正式编写路由 （三个步骤）

- 编写校验器
- 校验传入的参数的账号密码是否存在数据库
- 返回响应

**对`account`和`secret`进行校验,然后校验登录方式合法**

```js


class Loginvalidator extends Linvalidator{
    constructor(){
        super()
        this.account = [
            new Rule('isLength',"账号不符合规范",{min:4,max:128})
        ]
        this.secret = [
          new Rule =('isOptional'),
          new Rule('isLength','密码长度必须大于6',{min:6})    
        ]
    }
    validateLoginType(params){
        const type = params.body.loginType
        if(!type){
            throw new Error('请传入登录方式')
        }
     if(!global.config.LoginType.isInType(type)){
            throw new Error('type参数不合法 ')
        }
    }
}

module.exports = {Loginvalidator}
```

> isOptional 参数可以传可以不传

当参数通过校验器时, 定义方法判断传入的参数是否在数据库中存在

```js
async function emailLogin (account,secret){
    const user = await User.vertifyEmail(account,secret)
}
```

> 一般情况下 校验传入的参数是否在数据库中,在模型中完成

user.js

```js
class User extends Model{
    async function vertifyEmail(account,secret){
        const user = await User.findOne({
            where:{
                email:account
            }
        })
        if(!user){
            throw 没有此账户的错误异常
        }
        // 判断密码是否和不加密前的密码相同
        const corret = bcrypt.compareSync(secret,User.password)
        if(!corret){
            throw 密码错误异常
        }
        return user
    } 
}
```



模型定义完之后

###### 书写路由

```js
router.get('/token',async(ctx,next)=>{
    const v = new Loginvalidator().validate(ctx)
    const type = v.get('body.loginType')
    const account = v.get('body.account')
    const secret = v.get('body.secret')
    switch(type){
        case LoginType.USER_EMAIL:
            // 检验密码
            await emailLogin(account,secret)
            break;
        case :
        break;
    }
    // 暂时返回token
    ctx.body={
        token
    }
})
```

###### 微信登录接口

首先定义好需要的三个参数

```js
URL
appId
appSecret
```

```js
class wxManager{
    static async openidTotoken(code){
        // 拼接url
        const url = util.format(URL,appId,appSecret,code)
        const result = await axios.get(url)
        if(result.status!==200){
            throw new getOpenIDException()
        }
        if(result.data.errcode!==0){
            throw new getOpenIDException('获取openID失败'+result.data.errcode)
        }
        // 成功后 查询数据库 然后插入数据库 再获取token
        let user = User.getOpenIdUser(result.data.openid)
        if(!user){
           user = User.registerOpenId(result.data.openid)
        }
        let token = generate(user.id,Auth.USER)
    }
}
```

> **util.forma**t Node.js提供的util的API,可以将第一个参数中的占位符换成后面的参数 
>
> **getOpenIdUser**   Model层中定义的静态方法 查询user
>
> **registerOpenId**  插入openid
>
> Auth.USER  提前定义在Auth 获取令牌的class中的，表示权限的值 用户  只需要判断scope和传入的level值（当传入的level小于用户级别的scope时就可以获取token,反之就不可以）
>
> ```js
> class Auth {
> constructor(level){
>     this.level = level || 1
>     Auth.USER = 8
>     Auth.ADMIN = 16
>     Auth.SUPER_ADMIN = 32
> }
> }
> ```

**书写完微信登录获取openid之后，可以书写一个校验拿到的token的方法**

```js
static verifyToken(token){
    try {
       jwt.verify(token, global.config.security.secretKey)
      return true
    } catch (error) {
      return false
    }
  }
```

当前端从`Storage`里面拿出token,检验它的合法性，然后再继续走下去



###### 颁布令牌,获取token

在获取`token`之前先了解`jwt`的主要API

```js
jwt.sign() // 生成令牌  需要传入参数:1.传入自定义信息(后面可封装在auth里) 2.secretKey秘钥(用户自定义) 3.配置（失效时间）

例:jwt.sign(
   {uid,scope},secretKey,{expiresIn}
  )


jwt.verify() //校验令牌 如果token无效会抛出异常
// 需要传入 token 秘钥 两个个参数  
最好是放在try catch中捕获异常
```

- 定义基本配置

  ```js
  security = {
      secretKey:'abcdefg',// 自定义
      expiresIn:60*60 //令牌时效
  }
  ```

- 书写颁发令牌方法

  ```js
  const generateToken = function(uid,scope){
      const token= jwt.sign({uid,scope},security.secretKey,{expiresIn})
      return token
  }
  ```

- 登录时获取token

  ```js
  async function emailLogin(account,secret){
      // user 登录时获
  
      
      
      const token = generate(user.id,2)
      return token
  }
  ```
  
  ```js
   async function vertifyEmail(account, secret) {
    const user = await User.findOne({
      where: {
        email: account
      }
    })
    if (!user) {
      throw new LoginExecption('账号不存在')
    }
    if (!bcrypt.compareSync(secret, user.password)) {
      throw new LoginExecption('密码输入错误')
    }
    return user
  }
  ```
  
  
  
  


#### 路由携带令牌校验

想清楚三件事: 

1. token约定放在`header`还是`body`中 
2. 用什么方式来检验token是否合法
3. 校验令牌中间件放在什么位置

> 具体思路：首先一般情况下token在HTTPBasicAuth规则中是放在header部分的，然后我们通过这种方式测试
>
> 校验合法性，书写中间价时调用 `jwt.verify()`来检验合法token
>
> 校验令牌必须放在路由中间件前面,因为是最高权重 只有放了权限才能进行后面

```js
const baseAuth = require('base-auth')
class Auth {
    constructor(){}
    get m(){
        return async (ctx,next)=>{
            // 获取basicAuth的token值  而且这里必须用原生API req
            const UserToken = baseAuth(ctx.req)
            if(!USerToken || !UserToken.name){
                throw new token异常
            }
            try{
                var decode = jwt.verify(UserToken,secretKey)
                // 校验令牌合法 不合法抛出异常
            }catch(error){
                 if (error.name == 'TokenExpiredError') {
          errMsg = 'token令牌已经过期'
        }
        throw new ForbidenException(errMsg)
            }
        }
        ctx.auth = {
            uid:decode.uid,
            scope:decode.scope
        }
        // 下一个中间件执行
        await next()
    }
    
}
```

> new Auth().m  这里 m并不是方法 是class里面属性 通过get获取  实则是个中间件函数

校验完令牌之后,在router.get('') 中间注册中间件 `new Auth().m`



#### 前端携带令牌(BasicAuth方式)  (API key方式)

在发送HTTP请求时，加入这样的header

```js
header:{
    Authorization:Basic base64(account:password) //必须 是base64加密后的token信息
}

// base64基本用法
import {Base64} from 'base64-js'
const base64 = Base64.encode(token+':')
return 'Basic'+base64
```

此时携带的令牌数据就可以传递

```js
header:{
    Authorization:封装的函数
}
```

使用API key方式就不需要base64加密处理

```js
// 拿到约定好放在header或者query的token
class Auth {
    get m(){
        return async(ctx,next)=>{
            const UserToken = ctx.request.header.token
            if(!USerToken){
                throw new token不合法异常
            }
            // 校验token合法性
            try{
                var decode = jwt.verify(UserToken,global.config.secretKey)
            }catch(error){
              if(error.name ='TokenExpiredError'){
                  throw new Error('令牌过期')
              }
                throw new token不合法
            }
        }
    }
}
```

前端调用:

```js
wx.request({
    url:'',
    method:'POST',
    header:{
        token:wx.getStorageSync('token')
    },
    success:(res)=>{
        console.log(res.data)
    }
})
```







 ### 具体业务

首先先把数据表的概念分清

- 业务表  ： 解决业务问题 抽象出来的，记录业务 比如说:一期又一期的期刊，存放他们不同的index来区分期刊

- 实体表 ：具体到某个模型的数据，各种字段

  sequelize操控数据库具体参考[地址]( https://itbilu.com/nodejs/npm/V1PExztfb.html#api )

  模型层：分出 classic art flow user favor 

  定义模型层

  > 引入sequelize实例 
  >
  > 定义字段
  >
  > 导出模型 

  > classic: 分为 movie sentence music  共同字段定义
  >
  > art ：所有的实体,所有期刊  由几个模型拼凑
  >
  > flow: 业务模型 应有的字段:`art_id`,`index`,`type`  对取出实体模型记录非常重要
  >
  > user: 用户模型 
  >
  > favor

#### 获取最新一期期刊

获取最新一期,就是拿出期刊号最大的那一个实体。 

> fow表降序取出第一条记录

```js
router.get('/latest', new Auth().m,async(ctx)=>{
   let latest = async folw.findOne({
       // sequlize排序 写法 升序 ASC
       order:[
           ['index','DESC']
       ]
   })
   let art = async Art.getOne(latest.index)
   art.setDataValue('index',latest.index)
    ctx.body = art
  
})
```

前端请求数据之前需要携带令牌,

Art模型中定义查找记录方法

```js
class Art {
    // 传入art_id 和 type
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
```

#### 点赞 取消点赞

> 首先确定业务，**点赞和取消点赞需要操作两张表**，一张表记录用户点赞的记录，另一张实体表里面的收藏数量就会增加，或者减少

- 对业务表添加记录或者删除记录
- 修改实体表的数据

保证两个操作都能同时进行，可以使用数据库的`事物`

sequelize操作数据库的事物

```js
sequelize.transaction(async (t)=>{
    ...
})
```

```js
// 首先获取Favor中是否该用户点过赞 然后如果没有点赞向数据库添加一条记录 并且增加art实体的fav_nums

const favor =await Favor.finOne({
    where:{
        uid,art_id,type
    }
})
if(favor){
    throw new LikeException('已经点过赞')
}
// 事务一定要用return的方式执行
return sequelize.trancation(async t =>{
    await Favor.create({
        art_id,
        type,
        uid
    },{transcation : t})
    const art =await Art.getOne(art_id,type)
    // 自增涨一个字段 by 增长值
    await art.increment('fav_nums',{by:1,transaction:t})
})

// dislike 同理 
软删除 增加一条deleted_at
MOdel.class.destroy(force:false,transcation:t)
```

#### 上一期 下一期

> 首先查找flow表中index的记录，然后index+1 ，增加异常判断，查询出art表的记录，并田间like_status和index

```js

router.get('/:index/next',new Auth().m,async(ctx)=>{
  // 校验 获取art_id type 获取实例 然后增加属性
 const v = await new IndexValidator().validate(ctx)
 const index = v.get('path.index')
 const next = await flow.findOne({
   where:{
     index:index + 1  
   }
 })
 if(!next){
   throw new NotFoundException('没有下一期了')
 }
 let art = await Art.getOne(next.art_id,next.type)
 const like_status = await Favor.Userlike(ctx.auth.uid,next.art_id,next.type)
 art.setDataValue('index',next.index)
 art.setDataValue('like_status',like_status)
 ctx.body = art
})
```

#### 获取点赞信息

> 传入uid, art_id和type对favor表进行记录查询，返回布尔值

```js
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
```

#### 获取某一期的详情信息

> 传入type和art_id查找flow的记录 找到后查找like_status和index

```js
router.get('/:type/:id/detail',new Auth().m,async(ctx)=>{
  const v = await new ClassicValidator().validate(ctx)
  const art_id = v.get('path.id')
  const type = parseInt(v.get('path.type'))
  const classic = await flow.scope('bh').findOne({
    where:{
      art_id,
      type:{
        [Op.not]:400
      }
    }
  })
  if(!classic){
    throw new NotFoundException('找不到该资源')
  }
  let art = await Art.getOne(art_id,type)
  const like_status = await Favor.Userlike(ctx.auth.uid,art_id,type)
  art.setDataValue('index',classic.index)
  art.setDataValue('like_status',like_status)
  ctx.body = {
    art
  }
})
```

#### 获取用户喜欢期刊列表

> 传入uid查询favor表得到一个数组，然后Art模型编写获取列表方法
>
> 定义一个对象 注意json的key永远都是字符串
>
> ```js
> const artInfoObj ={
> 	100:[],
> 	200:[],
> 	300:[]
> }
> ```
>
> 获取列表元素 for循环 artInfoList
>
> `artInfoObj[artinfo.type].push(artinfo.art_id)`
>
> 再循环对象 查找type下的数组列表
>
> ids artInfoObj[key] 
>
> type key
>
> 如果是空数组 跳出循环
>
> for循环不需要定义大量的复杂逻辑,封装一个函数
>
> 注意：obj的key是字符串  传参会报错
>
> 循环引用会报undefined  解决方法：局部导入
>
> 最终结果需要将所有的数组提取到大数组  [[],[],[]]
>
> 使用`faltten`方法

```js
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
```



#### 获取热门图书 

```js
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
```



#### 评论




定义book模型 id fav_nums

从服务器请求数据 返回详情



图书搜索

定义校验器  三个参数 query ：keyword，start count

 start 可传可不传  传一个默认值  summary=1 鱼书搜索不返回概要信息

encodeURI(q)  将可能为中文的编码转换



#### json序列化

再返回的字段中定义`toJSON`方法指定返回的字段，sequelize就定义在模型中 实例方法。

`this.getDataValue()`

```js
toJSON(){
    return {
        content:this.getDataValue('content')
    }
}
```

![](https://image.yangxiansheng.top/img/QQ截图20200329204854.png?imagelist)

原型链方法定义Model方法 删除dataValues的某些字段

#### KOA-STATIC

处理静态资源  __dirname 项目目录

```js
访问/static文件夹
const static = require('koa-static')
const path = require('path')
app.use(static(path.join(__dirname,'/static')))
// 这样localhost路径 就可以访问到static文件夹下的文件

添加配置:host:'http://localhost:3000/'
```

![](https://image.yangxiansheng.top/img/QQ截图20200329221551.png?imagelist)

art模型替换image路径

#### 自动无感知刷新令牌

```js
_request(url, resolve, reject, data = {}, method = 'GET', noRefetch = false) {
    wx.request({
      url: api.url,
      method: method,
      data: data,
      header: {
        Authorization: wx.getStorageSync('token');
      },
      success: (res) => {
        const code = res.statusCode
          if (code === 403) {
            if (!noRefetch) {
              _refetch(
                url,
                resolve,
                reject,
                data,
                method
              )
            }
          }
        }
    })
  }
  _refetch(...param) {
    getTokenFromServer((token) => {
      this._request(...param, true);
    });
  }

```


## Author

👤 **努力中的杨先生**

* Website: https://me.yangxiansheng.top/
* Github: [@251205668](https://github.com/251205668)
* LinkedIn: [@https:\/\/github.com\/251205668](https://linkedin.com/in/https:\/\/github.com\/251205668)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/251205668/Node_review/issues). You can also take a look at the [contributing guide](https://github.com/251205668/Node_review/issues).

## Show your support

Give a ⭐️ if this project helped you!

<a href="https://www.patreon.com/努力中的杨先生">
  <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>

## Thanks

Thanks for the explanation of node. js course given by the teacher `七月`, whose rigor of the course and exception handling of the project are all worthy of learning, which enabled me to acquire a lot of knowledge of Node and make my understanding of javascript to a higher level.Thanks!!

Here are the coruse of the project :[course](https://coding.imooc.com/class/342.html)

![](https://image.yangxiansheng.top/img/QQ截图20200330215308.png?imagelist)

## 📝 License

Copyright © 2020 [努力中的杨先生](https://github.com/251205668).<br />
This project is [MIT](https://github.com/251205668/Node_review/blob/master/LICENSE) licensed.
