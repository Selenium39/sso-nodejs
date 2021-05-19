const router = require('koa-router')()

router.get('/index', async (ctx, next) => {
  await ctx.render('index', {
    username: ctx.state.username
  })
})

module.exports = router
