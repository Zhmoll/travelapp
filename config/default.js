var MongoStore = require('connect-mongo')(session);

var mongodbUrl = 'mongodb://localhost:27017/travel';

module.exports = {
  port: 3000,
  session: {
    name: 'travelsid',
    secret: 'zhmolldashuaibi',
    resave: true,
    cookie: {
      maxAge: 1000 * 3600 * 24
    },
    store: new MongoStore({
      url: mongodbUrl + 'Session'
    })
  },
  mongodb: mongodbUrl
};
