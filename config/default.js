module.exports = {
  port: 3000,
  mongodb: 'mongodb://localhost:27017/travel',
  token: {
    secret: 'zhmolldashuaibi',
    timeStep: 5,
    maxAge: 60 * 60 * 24 * 7
  }
};