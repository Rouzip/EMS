import http from 'http'

import Koa from 'koa'
import logger from 'koa-logger'
import convert from 'koa-convert'
import koaStatic from 'koa-static'
import bodyParser from 'koa-bodyparser'

import router from './router'
import db from './model'


const app = new Koa()


// 解决跨域，添加头
app.use(async(ctx, next) => {
  ctx.set('Access-Control-Allow-Credentials', 'true')
  ctx.set('Access-Control-Allow-Origin', 'http://localhost:8080')
  await next()
})


// 捕捉全部错误
app.use(async(ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
})

db.sequelize.sync()

// 写日志
app.use(convert(logger()))

// 解析请求格式
app.use(bodyParser())

// 添加路由
app.use(router.routes(), router.allowedMethods())

// 添加监听程序
http.createServer(app.callback()).listen(3000).on('listening', ()=> {
  console.log('正在监听端口3000')
})

export default app