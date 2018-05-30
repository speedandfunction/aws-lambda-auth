# aws-lambda-auth

The library allows you to write lambda custom authorizers easier.

## Installation

```sh
npm install aws-lambda-auth
```

## Using
You have to override handler (`AuthHandler`) that will generate a policy depends on your conditions.

Let's do it first of all. Minimal case can look so:
```js
const {AuthHandler, utils} = require('aws-lambda-auth');

class MyHandler extends AuthHandler {
  get name() {
    // The handler have to be named
    return 'I will see this name in logs';
  }

  get policyArn() {
    // You have to restrict access to certain ARN
    return utils.buildExecutionApiArn({path: 'users/*'});
  }
}
```

Then you can use this handler in auth flow:
```js
const {SingleAuthFlow, lambda} = require('aws-lambda-auth');

export default lambda(async ({lambdaEvent, lambdaContext}) => {
  // In real life you will extract token from header or context
  const jwtToken = lambdaEvent.headers.Authorization;
  // You have to decode passed token and pass payload to flow
  // so that you can compare it, check access, etc.
  const tokenPayload = decode(jwtToken);

  return new SingleAuthFlow({lambdaEvent, lambdaContext, tokenPayload})
    .useHandler(MyHandler)
    .createPolicy();
});
```

That's all. You can build a bundle and deploy to the AWS.

### Single flow
Use this flow when there is only one type of user.

[look at the example](./examples/functions/single-flow)

### Multiple flow
Use this flow when there are a few types of users and you want to handle each independently.

[look at the example](./examples/functions/multiple-flow)

### Middlewares
Middlewares allow you to extend lambda context so that you will have a chance to
use it in your handlers.

[look at the example](./examples/functions/middleware)

### Utils

#### buildExecutionApiArn
Allows you to build ARN.

Params and default:
 - `region = '*'`
 - `acountId = '*'`
 - `appId = '*'`
 - `stage = '*'`
 - `method = '*'`
 - `path = '*'`
