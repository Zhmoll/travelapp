var express = require('express');

module.exports = function (app) {

  // app.use('/api/homepage',require('./homepage'));
  // app.use('/api/users',require('./users'));
  // app.use('/api/travel',require('./travel'));

  // app.use('/api/login',require('./login'));
  // app.use('/api/logout',require('./logout'));
  // app.use('/api/reg',require('./reg'));
  app.use('/api/signup', require('./signup'));
}