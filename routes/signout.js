const router = require('express').Router();
const Token = require('../models/token');
const checkLogin = require('../middlewares/checkLogin');

router.get('/', checkLogin, function (req, res, next) {
  Token.find({ token: res.locals.token }, function (err, tokens) {
    if (err) return next(err);

    tokens.forEach(function (token) {
      token.remove();
    });

    return res.json({
      type: 'success',
      code: 42000,
      message: '注销成功'
    });
  });
});

module.exports = router;