var Token = require('../models/token');

function checkLogin(req, res, next) {
  var token = req.get('Authorization') || req.query.accesstoken;

  if (!token) {
    res.json({
      type: 'error',
      code: 42001,
      message: '您尚未登录或登录凭证无效'
    });
    return;
  }

  Token.findOne({ token: token }, function (err, token) {
    if (err) return next(err);

    if (!token) {
      res.json({
        type: 'error',
        code: 42001,
        message: '您尚未登录或登录凭证无效'
      });
      return;
    }
    
    res.locals.userid = token.userid;
    res.locals.token = token.token;
    return next();
  });
}

module.exports = checkLogin;