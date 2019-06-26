var express = require('express');
var router = express.Router();

router.post('/login', function(req, res, next) {
  res.json({
    errno: 0,
    data: '登录成功'
  });
});

module.exports = router;
