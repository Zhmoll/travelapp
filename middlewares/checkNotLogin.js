var Token = require('../models/token');

function checkNotLogin(req, res, next) {
  var token = req.get('Authorization') || req.query.accesstoken;
  if (!token) {
    return next();
  }

  Token.findOne({ token: token }, function (err, token) {
    if (err) return next(err);

    if (!token) {
      return next();
    }

    res.json({
      "type": "error",
      "code": "42002",
      "message": "您已经登录"
    });
  });
}

module.exports = checkNotLogin;