const P = require('bluebird');

module.exports = function lambdaHandler(originLambdaFunction, middlewares = []) {
  return (e, ctx, cb) => {
    runMiddlewares({middlewares, ctx})
      .then((newCtx) => originLambdaFunction({event: e, ctx: newCtx}))
      .then((res) => cb(null, res))
      .catch(cb);
  };
};

function runMiddlewares({middlewares, ctx}) {
  return middlewares
    .reduce(
      (chain, middleware) => chain.then((mutatedCtx) => middleware(mutatedCtx)),
      P.resolve(ctx),
    );
}
