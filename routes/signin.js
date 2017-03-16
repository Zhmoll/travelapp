var express = require('express');
var router = express.Router();

var User = require('../models/users');
var Token = require('../models/token');

router.post('/', function (req, res, next) {
  var credential = req.body.credential;

  User.findOne({
    username: credential.username,
    password: credential.password
  }, 'username avatar gender nickname', function (err, user) {
    if (err) return next(err);

    if (!user) {
      res.json({
        type: 'error',
        code: 41001,
        message: '用户名或密码错误'
      });
      return;
    }

    Token.createToken(user.id, function (err, token) {
      if (err) return next(err);
      res.setHeader('Authorization', token.token);
      res.json({
        type: 'succees',
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