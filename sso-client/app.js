const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
var request = require('koa2-request');
var session = require('koa-session')

const index = require('./routes/index')
const {
  v4: uuid
} = require('uuid');

app.keys = ['selenium39'];

const CONFIG = {
  key: 'koa.sess',
  maxAge: 86400000,
  autoCommit: true,
  overwrite: true,
  httpOnly: false,
  signed: true,
  rolling: false,
  renew: false,
  secure: false,
  sameSite: null,
};

app.use(session(CONFIG, app));

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

//authority request filter
app.use(async (ctx, next) => {
  let token = ctx.cookies.get('token')
  let { tk } = ctx.request.query
  console.log('token:', token, 'tk: ', tk)
  let originUrl = ctx.request.href
  if (!(tk || token)) {
    ctx.redirect(`http://www.c.com:3000/view/login?originUrl=${originUrl}`)
  } else if (tk) {
    let response = await request({
      url: `http://www.c.com:3000/validate?tk=${tk}`,
    })
    let username = response.body
    if (username) {
      ctx.state.username = username
      let token = uuid().replace(new RegExp("-", "g"), "").toLocaleLowerCase()
      ctx.session[token] = tk
      ctx.cookies.set('token', token, {
        maxAge: 60 * 60 * 1000, //有效时间，单位毫秒
        httpOnly: false,
        path: '/',
      });
    } else {
      //todo ticket not exist
    }
  } else {
    console.log(ctx.session)
    let tk = ctx.session[token]
    console.log('tk777:', tk)
    let response = await request({
      url: `http://www.c.com:3000/validate?tk=${tk}`,
    })
    let username = response.body
    if (username) {
      ctx.state.username = username
      let token = uuid().replace(new RegExp("-", "g"), "").toLocaleLowerCase()
      ctx.session[token] = tk
      ctx.cookies.set('token', token, {
        maxAge: 60 * 60 * 1000, //有效时间，单位毫秒
        httpOnly: false,
        path: '/',
      });
    } else {
      //todo
    }
  }
  await next()
})

// routes
app.use(index.routes(), index.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
