var express = require('express');
var router = express.Router();
var Token = require('../models/token');
var checkLogin = require('../middlewares/checkLogin');

router.get('/', checkLogin, function (req, res, next) {
  Token.find({ token: res.locals.token }, function (err, tokens) {
    if (err) return next(err);

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