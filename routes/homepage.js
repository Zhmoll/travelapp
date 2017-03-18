var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  var ip = req.ip;
  return res.json({
    type: "success",
    code: 20000,
    message: "首页获取成功"
  });
});

module.exports = router;