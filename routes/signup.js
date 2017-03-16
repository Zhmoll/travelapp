var express = require('express');
var router = express.Router();

var User = require('../models/users');
var Token = require('../models/token');

router.post('/', function (req, res, next) {
  var credential = req.body.credential;

  User.findOne({
    username: credential.username
  }, function (err, user) {
    if (err) return next(err);

    if (user) {
      res.json({
        type: 'error',
        code: 40001,
        message: '用户已存在'
      });
      return;
    }

    User.create({
      username: credential.username,
      password: credential.password
    }, function (err, user) {
      if (err) return next(err);

      Token.createToken(user.id, function (err, token) {
        if (err) return next(err);
        res.setHeader('Authorization', token.token);
        res.json({
          type: 'succees',
          code: 40000,
          message: '用户登录成功',
          result: {
            token: token.token,
            user: {
              _id: user._id,
              username: user.username,
              nickname: user.nickname,
              gender: user.gender,
              avatar: user.avatar
            }
          }
        });
      });
    });
  });
});

module.exports = router;