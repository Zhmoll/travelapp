var express = require('express');

module.exports = function (app) {
  app.use('/api/signup', require('./signup'));
  app.use('/api/signin', require('./signin'));
};