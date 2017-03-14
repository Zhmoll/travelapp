var express = require('express');
var router = express.Router();
var UserModel = require('../models/users');

// {
//   credential:{
//     username:'zhmoll';
//     password:'123123';
//   }
// }
router.post('/', function (req, res, next) {
  //todo检查credential是否存在
  var username = credential.username;
  var password = credential.password;
  //todo检查密码是否符合要求

  UserModel.findOne({
    username:username,
    password:password
  },function(err,user){
    if(err) return next(err);

    if(!user){
      res.send({ 'status': 'error', 'message': '用户名或密码错误' });
      return ;
    }

    req.session.user=user;
    res.send({ 'status': 'succeed', 'message': '登录成功' });
  })

});