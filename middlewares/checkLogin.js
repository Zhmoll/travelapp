function checkLogin(req,res,next){
  if(!req.session.user) {
    req.flash('error', '你还没有登录！');
    return res.redirect('/login');
  }
  next();
}

function checkNotLogin(req,res,next){
  if(req.session.user){

  }
}

module.exports = {
  checkLogin: checkLogin,
  checkNotLogin: checkNotLogin
}