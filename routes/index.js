module.exports = (app) => {
  app.use('/api', function (req, res, next) {
    res.redirect('https://github.com/Zhmoll/travelapp/blob/dev/api.md');
  });
  
  app.use('/api/homepage', require('./homepage'));

  app.use('/api/city', require('./city'));
  app.use('/api/item', require('./item'));
  app.use('/api/profile', require('./profile'));
  app.use('/api/signup', require('./signup'));
  app.use('/api/signin', require('./signin'));
  app.use('/api/signout', require('./signout'));

  app.use('/api/manage', require('./manage'));
  app.use('/apidoc', function (req, res, next) {
};