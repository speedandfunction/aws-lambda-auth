const AuthHandler = require('./lib/auth/AuthHandler');
const SingleAuthFlow = require('./lib/auth/SingleAuthFlow');
const MultipleAuthFlow = require('./lib/auth/MultipleAuthFlow');
const lambda = require('./lib/lambda');
const utils = require('./lib/utils');
const middlewares = require('./lib/middlewares');

module.exports = {
  AuthHandler,
  SingleAuthFlow,
  MultipleAuthFlow,
  middlewares,
  lambda,
  utils,
};
