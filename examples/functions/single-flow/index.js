import {SingleAuthFlow, lambda, utils} from '../../../index';
import UserHandler from './UserHandler';

export default lambda(async ({lambdaEvent, lambdaContext}) => {
  // Extreact "Bearer <token>" from "headers.Authorization" header
  const bearerToken = utils.extractTokenFromEvent(lambdaEvent);
  const tokenPayload = await decodeToken(bearerToken);

  return new SingleAuthFlow({lambdaEvent, lambdaContext, tokenPayload})
    .addHandler(UserHandler)
    .createPolicy();
});

async function decodeToken(lambdaEvent) {
  // Decode token with your sercret
  // and return object with payload
  return {
    userId: '12331',
  };
}
