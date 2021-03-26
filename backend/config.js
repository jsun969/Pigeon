module.exports = {
  app: {
    port: 3000,
    origin: ['http://localhost:8080'],
  },
  db: {
    username: '',
    password: '',
    host: 'localhost',
    port: 27017,
    name: 'pigeon',
  },
  token: {
    secret: '114514',
    maxAge: 60 * 60 * 24 * 7,
  },
};
