const {SingleAuthFlow, lambda, utils} = require('../../../index');
const UserHandler = require('./UserHandler');

module.exports = lambda(async ({lambdaEvent, lambdaContext}) => {
  const bearerToken = utils.extractTokenFromEvent(lambdaEvent);
  const tokenPayload = await decodeToken(bearerToken);

  return new SingleAuthFlow({lambdaEvent, lambdaContext, tokenPayload})
    .addHandler(UserHandler)
    .createPolicy();
});

async function decodeToken(lambdaEvent) {
  // Decode token with your sercret
  // and return object with payload
  return lambdaEvent;
}
