var express = require('express');
var router = express.Router();
const { SuccessModel, ErrorModel } = require('./../modle/resModle');
const { 
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog } = require('./../controller/blog');

router.get('/list', function(req, res, next) {
  let author = req.query.author || '';
  const keyword = req.query.keyword || '';

  const result = getList(author, keyword);
  return result.then((listResult) => {
      res.json(new SuccessModel(listResult));
  })
});

module.exports = router;
