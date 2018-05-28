const {MultipleAuthFlow, lambda, utils} = require('../../../index');
const UserHandler = require('./UserHandler');
const AdminHandler = require('./AdminHandler');

module.exports = lambda(async ({lambdaEvent, lambdaContext}) => {
  const bearerToken = utils.extractTokenFromEvent(lambdaEvent);
  const tokenPayload = await decodeToken(bearerToken);

  return new MultipleAuthFlow({lambdaEvent, lambdaContext, tokenPayload})
    .addHandler(UserHandler, () => tokenPayload.role === 'USER')
    .addHandler(AdminHandler, () => tokenPayload.role === 'ADMIN')
    .createPolicy();
});

async function decodeToken(lambdaEvent) {
  // Decode token with your sercret
  // and return object with payload
  return lambdaEvent;
}
