module.exports = (app) => {
  app.use('/api/homepage', require('./homepage'));

  app.use('/api/city', require('./city'));
  app.use('/api/item', require('./item'));
  app.use('/api/signup', require('./signup'));
  app.use('/api/signin', require('./signin'));
  app.use('/api/signout', require('./signout'));

  app.use('/api/manage', require('./manage'));
};