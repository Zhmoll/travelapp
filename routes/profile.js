const router = require('express').Router();
const checkLogin = require('../middlewares/checkLogin');
const User = require('../models/users');

router.put('/', checkLogin, function (req, res, next) {
  const body = req.body;
  const userid = res.locals.userid;

  User.findById(userid, function (err, user) {
    if (err) return next(err);

    user.password = body.password || user.password;
    user.gender = body.gender || user.gender;
    user.avatar = body.avatar || user.avatar;
    user.nickname = body.nickname || user.nickname;

    user.save(function (err, user) {
      if (err) return next(err);
      user.password = undefined;
      user.authority = undefined;
      res.json({
        "type": "success",
        "code": 43000,
        "message": "用户信息修改成功",
        "result": {
          user: user
        }
      });
    });
  });
});

module.exports = router;