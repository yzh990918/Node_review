## 基础

编写一个接口的最基本代码

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

### 中间件

中间件-发送http调用的函数，一个实例可以定义多个中间件，中间件调用总是返回`promise`

`app.use`注册中间件。`ctx`上下文，`next`下一个中间件

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

传递参数
通过挂载到ctx传参,首先要保证洋葱模型

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

### 洋葱模型

先执行fun1上 再执行中间件函数 在执行fun1下。可以判断函数是否完全执行，以中间件函数为分界线
![](https://image.yangxiansheng.top/img/QQ截图20200321195714.png?imagelist)

简单的例子:

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

使用async,await强制promise同步调用化，调用顺序
fun1() ====> fun2() ====> fun1下

### async await

await特性:

- 求值
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

- 阻塞线程
    常见的异步调用:`对资源 读文件 操作数据库 发送http`    

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

### 路由

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

### 改造 路由

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



### 校验处理

#### 获取参数

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

#### 异常处理

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

#### 参数校验

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


### sql复习

#### 创建数据库

```sql
CREATE DATABASE 数据库名
```

#### 删除数据库

```sql
DROP DATABASE 数据库名
```

#### 创建表

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

![1585018919602](C:\Users\努力中的杨先生\AppData\Roaming\Typora\typora-user-images\1585018919602.png)



#### 删除表

```sql
DROP TABLE 表名;
```

#### 查看表结构

```sql
DESC 表名
```

#### 修改表结构

```sql
修改列名
Alter table 表名  change  列名  新列名 类型;

修改列类型
Alter table 表名  modify  列名  新类型;
```

#### 增

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

#### 删

```sql
delete from 表 where 条件
```

#### 改

```sql
update 表 set 字段=值 where 条件
例: update user set username=7yue where id =1;
```

#### 查

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





### sequlize(模型导入数据库)

#### 初始化配置 

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

model下创建user.js  更多定义方法 参考[模型类型定义]( https://sequelize.org/v5/manual/data-types.html )

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

![1584979877301](C:\Users\努力中的杨先生\AppData\Roaming\Typora\typora-user-images\1584979877301.png)





### 注册

#### 编写校验器  

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

#### 编写注册API  （标准流程）

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

#### 明文加密

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

### 登录

#### 准备工作

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

#### 书写路由

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

#### 颁布令牌,获取token

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
      const token = generate(user.id,2)
      return token
  }
  ```


### 路由携带令牌校验

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
