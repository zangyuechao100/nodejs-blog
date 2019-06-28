const router = require('koa-router')()
const { 
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog } = require('./../controller/blog');
const { SuccessModel, ErrorModel } = require('./../model/resModel');
const loginCheck = require('./../middleware/loginCheck');

router.prefix('/api/blog')

router.get('/list', async function (ctx, next) {
  let author = ctx.author || '';
  const keyword = ctx.keyword || '';
  if (ctx.isadmin) {
    console.log('is admin')
    // 管理员界面
    if (ctx.session.username == null) {
        console.error('is admin, but no login')
        // 未登录
        ctx.body = new ErrorModel('未登录')
        return
    }
    // 强制查询自己的博客
    author = ctx.session.username
  }
  const listResult = await getList(author, keyword);
  ctx.body = new SuccessModel(listResult);
})

router.get('/detail', async function (ctx, next) {
  const deatilData = await getDetail(ctx.query.id);
  ctx.body = new SuccessModel(deatilData);
})

router.post('/new', loginCheck, async function (ctx, next) {
  const author = ctx.session.username;
  ctx.request.body.author = author;
  const data = await newBlog(ctx.request.body);
  ctx.body = new SuccessModel(data);
})

router.post('/update', loginCheck, loginCheck, async function (ctx, next) {
  const result = await updateBlog(ctx.query.id, ctx.request.body);
  if (result) {
    ctx.body = new SuccessModel();
  } else {
    ctx.body = new ErrorModel('更新失败');
  }
})

router.post('/del', loginCheck, async function (ctx, next) {
  const author = ctx.session.username;
  const result = await deleteBlog(ctx.query.id, author);
  if (result) {
    ctx.body = new SuccessModel();
  } else {
    ctx.body = new ErrorModel('删除失败');
  }
})

module.exports = router
