export const environment = {
  production: false,
  auth: {
    refresh: '/api/refresh',
    logout: '/api/logout',
    registration: '/api/registration',
    login: '/api/login',
  },
  user: {
    users: '/api/users'
  },
  massage: {
    send: 'http://localhost:5001/new-messages',
    connect:'http://localhost:5001/connect'
  }
};
