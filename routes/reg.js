var express = require('express');
var router = express.Router();
var promise = require('bluebird');
var UserModel = require('../models/users');
var _ = require("lodash");

function checkCredential(credential) {
  var e;
  if (!credential) {
    e = new Error('请填写注册信息');
  }
  if (!credential.username) {
    e = new Error('需要填写用户名');
  }
  if (!credential.password) {
    e = new Error('需要填写密码');
  }
  if (credential.username.length < 5 || credential.username.length > 16) {
    e = new Error('用户名长度无效');
  }
  // if (credential.password.length != 20) {
  //   throw new Error('密码无效');
  // }

  // todo 
  // 对密码进行处理
  if (e) return e;
  else return credential;
}

function checkProfile(profile) {
  var e;
  if (!profile) {
    return;
  }
  if (profile.gender && !_.includes(['m', 'f', 'x'], profile.gender)) {
    throw new Error('不正确的性别标识');
  }
  if (e) return e;
  else return profile;
}

// POST /api/reg 
// 理想的注册信息
// {
//   credential:{
//     username: 'Zhmoll';
//     password: '7fd04df92f636fd450bc';
//   };
//   profile:{
//     gender:'m';//
//     avatar:'http://www.baidu.com/logo.jpg';
//   }
// }
router.post('/', function (req, res, next) {
  var credential = req.body.credential;
  var profile = req.body.profile;

  credential = checkCredential(credential);
  if (credential instanceof Error) {
    next(credential);
  }
  profile = checkProfile(profile);
  if (profile instanceof Error) {
    next(profile);
  }

  UserModel.find({ username: credential.username }, function (err, user) {
    if (err) return next(err);
    if (user.length!=0) {
      res.send({ 'status': 'error', 'message': '该用户名已存在' });
      return;
    }

    UserModel.create(credential, function (err, result) {
      if (err) next(err);
      req.session.user = credential.username;
      res.send({ 'status': 'succeed', 'message': '注册成功！' });
      return;
    });

  });

});

module.exports = router;