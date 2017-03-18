var Token = require('../models/token');

module.exports = function (req, res, next) {
  var token = req.get('Authorization') || req.query.accesstoken;

  if (!token) {
    res.json({
      type: 'error',
      code: 42001,
      message: '您尚未登录或登录凭证无效！'
    });
    return;
  }

  Token.findOne({ token: token }, function (err, token) {
    if (err) return next(err);

    if (!token) {
      res.json({
        type: 'error',
        code: 42001,
        message: '您尚未登录或登录凭证无效！'
      });
      return;
    }

    if (token.authority < 100) {
      return res.json({
        type: 'error',
        code: 90001,
        message: '您没有权限执行该操作!'
      });
    }

    res.locals.userid = token.userid;
    res.locals.token = token.token;
    res.locals.authority = token.authority;
    return next();
  });
}