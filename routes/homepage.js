const router = require('express').Router();

router.get('/', function (req, res, next) {
  const ip = req.ip;
  return res.json({
    type: "success",
    code: 20000,
    message: "首页获取成功"
  });
});

module.exports = router;