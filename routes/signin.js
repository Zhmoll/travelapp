const router = require('express').Router();
const User = require('../models/users');
const Token = require('../models/token');

const checkNotLogin = require('../middlewares/checkNotLogin');

router.post('/', checkNotLogin, function (req, res, next) {
  var credential = req.body.credential;

  User.findOne({
    username: credential.username,
    password: credential.password
  }, 'username avatar gender nickname', function (err, user) {
    if (err) return next(err);

    if (!user) {
      return res.json({
        type: 'error',
        code: 41001,
        message: '用户名或密码错误'
      });
    }

    Token.createToken(user.id, function (err, token) {
      if (err) return next(err);
      res.setHeader('Authorization', token.token);
      return res.json({
        type: 'success',
        code: 41000,
        message: '登录成功',
        result: {
          token: token.token,
          user: user
        }
      });
    });
  });
});

module.exports = router;