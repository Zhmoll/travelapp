const router = require('express').Router();
const User = require('../models/users');
const Token = require('../models/token');

const checkNotLogin = require('../middlewares/checkNotLogin');

router.post('/', checkNotLogin, function (req, res, next) {
  const credential = req.body.credential;
  const profile = req.body.profile;

  if (!credential || !credential.username || !credential.password) {
    return res.json({
      type: 'error',
      code: 41002,
      message: '凭据数据格式不正确'
    });
  }

  User.findOne({
    username: credential.username
  }, function (err, user) {
    if (err) return next(err);

    if (user) {
      return res.json({
        type: 'error',
        code: 40001,
        message: '用户已存在'
      });
    }

    let entity = {
      username: credential.username,
      password: credential.password,
      avatar: profile && profile.avatar,
      gender: profile && profile.gender,
      nickname: profile && profile.nickname
    };

    User.create(entity, function (err, user) {
      if (err) return next(err);

      Token.createToken(user.id, function (err, token) {
        if (err) return next(err);
        user.password = undefined;
        user.authority = undefined;
        res.setHeader('Authorization', token.token);
        res.json({
          type: 'success',
          code: 40000,
          message: '用户注册成功',
          result: {
            token: token.token,
            user: user
          }
        });
      });
    });
  });
});

module.exports = router;