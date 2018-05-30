const {expect} = require('chai');
const sinon = require('sinon');
const AuthHandler = require('../../../lib/auth/AuthHandler');
const SingleAuthFlow = require('../../../lib/auth/SingleAuthFlow');
const logger = require('../../../lib/logger');

describe('lib/SingleAuthFlow', () => {
  beforeEach(() => {
    sinon.stub(logger, 'log');
  });

  afterEach(() => {
    logger.log.restore();
  });

  it('should reject if validation is not passed', async () => {
    const handler = class MyHandler extends AuthHandler {
      get name() {
        return 'test';
      }

      get policyArn() {
        return 'api/*';
      }

      async validate() {
        throw new Error('User has no access');
      }
    };
    const promise = new SingleAuthFlow()
      .useHandler(handler)
      .createPolicy();

    return expect(promise).to.be.rejectedWith(/Unauthorized/);
  });

  it('should return policy according to handler', async () => {
    const handler = class MyHandler extends AuthHandler {
      get name() {
        return 'test';
      }

      get policyArn() {
        return 'api/*';
      }

      get policyPrincipalId() {
        return 'someId';
      }

      get policyContext() {
        return {some: 'id'};
      }

      async validate() {

      }
    };

    const policy = await new SingleAuthFlow()
      .useHandler(handler)
      .createPolicy();

    expect(policy.principalId).to.be.equal('someId');
    expect(policy.context).to.be.eql({some: 'id'});
    expect(policy.policyDocument.Statement).to.be.eql([{
      Action: 'execute-api:Invoke',
      Effect: 'Allow',
      Resource: 'api/*',
    }]);
  });
});
