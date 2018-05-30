const {expect} = require('chai');
const sinon = require('sinon');
const AuthHandler = require('../../../lib/auth/AuthHandler');
const MultipleAuthFlow = require('../../../lib/auth/MultipleAuthFlow');
const logger = require('../../../lib/logger');

describe('lib/MultipleAuthFlow', () => {
  beforeEach(() => {
    sinon.stub(logger, 'log');
  });

  afterEach(() => {
    logger.log.restore();
  });

  it('should reject if all handler is not defined', async () => {
    const promise = new MultipleAuthFlow()
      .useHandler(sinon.stub(), () => false)
      .useHandler(sinon.stub(), () => false)
      .createPolicy();

    await expect(promise).to.be.rejectedWith(/was not defined/);
  });

  it('should throw if handler was defined more then one time', () => {
    const execute = () => new MultipleAuthFlow()
      .useHandler(sinon.stub(), () => true)
      .useHandler(sinon.stub(), () => true)
      .createPolicy();

    expect(execute).to.throw(/already defined/);
  });

  it('should create instance of fisrt handler and pass all params', () => {
    const h1 = sinon.stub();
    const h2 = sinon.stub();
    const lambdaCtx = {a: 1};
    const lambdaEvent = {b: 1};
    const tokenPayload = {c: 1};

    new MultipleAuthFlow({lambdaCtx, lambdaEvent, tokenPayload})
      .useHandler(h1, () => true)
      .useHandler(h2, () => false);

    expect(h1).have.been.calledWithExactly({lambdaCtx, lambdaEvent, tokenPayload});
    expect(h2).have.been.not.called;
  });

  it('should create instance of second handler and pass all params', () => {
    const h1 = sinon.stub();
    const h2 = sinon.stub();
    const lambdaCtx = {a: 1};
    const lambdaEvent = {b: 1};
    const tokenPayload = {c: 1};

    new MultipleAuthFlow({lambdaCtx, lambdaEvent, tokenPayload})
      .useHandler(h1, () => false)
      .useHandler(h2, () => true);

    expect(h2).have.been.calledWithExactly({lambdaCtx, lambdaEvent, tokenPayload});
    expect(h1).have.been.not.called;
  });

  it('should create return policy according to handler', async () => {
    const h1 = sinon.stub();
    const h2 = class MyHandler extends AuthHandler {
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
    };

    const policy = await new MultipleAuthFlow()
      .useHandler(h1, () => false)
      .useHandler(h2, () => true)
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
