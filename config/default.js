module.exports = {
  port: 3000,
  mongodb: 'mongodb://localhost:27017/travel',
  token: {
    secret: 'zhmolldashuaibi',
    maxAge: 3600 * 24 * 7
  }
};