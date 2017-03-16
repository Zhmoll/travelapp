var express = require('express');
var router = express.Router();
var Token = require('../models/token');

router.get('/', function (req, res, next) {
  var token = req.get('Authorization');

  Token.find({ token: token }, function (err, tokens) {
    if (err) return next(err);

    if (tokens.length == 0) {
      res.json({
        type: 'error',
        code: 42001,
        message: '登录凭据不存在或失效'
      });
      return;
    }

    tokens.forEach(function (token) {
      token.remove();
    });

    res.json({
      type: 'success',
      code: 42000,
      message: '注销成功'
    });
  });
});

module.exports = router;