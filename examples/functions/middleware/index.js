const {
  SingleAuthFlow,
  lambda,
  utils,
  middlewares,
} = require('../../../index');
const UserHandler = require('./UserHandler');

// This middleware allow us to decode lambda VENV and pass it via lambdaContext
const kmsMiddleware = middlewares.kms(['MONGO_USER', 'MONGO_PASS']);

export default lambda(async ({lambdaEvent, lambdaContext}) => {
  // lambdaContext.kms will has decoded "MONGO_USER" and "MONGO_PASS"
  // so that we can connect to MongoDB to be able to check user access in "UserHandler"

  const bearerToken = utils.extractTokenFromEvent(lambdaEvent);
  const tokenPayload = await decodeToken(bearerToken);

  return new SingleAuthFlow({lambdaEvent, lambdaContext, tokenPayload})
    .addHandler(UserHandler)
    .createPolicy();
}, [kmsMiddleware]);

async function decodeToken(lambdaEvent) {
  // Decode token with your sercret
  // and return object with payload
  return lambdaEvent;
}
