const {expect} = require('chai');
const objectHash = require('object-hash');
const AuthHandler = require('../../../lib/auth/AuthHandler');

describe('lib/AuthHandler', () => {
  const tokenPayload = {usedId: 10};
  let handler;

  beforeEach(() => {
    handler = new AuthHandler({tokenPayload});
  });

  it('should throw when getter "name" is called', () => {
    expect(() => handler.name).to.throw(/must be implemented/);
  });

  it('should throw when getter "policyArn" is called', () => {
    expect(() => handler.policyArn).to.throw(/must be implemented/);
  });

  it('should generate policy principalId by passed "tokenPayload"', () => {
    const principalId = objectHash.MD5(tokenPayload);

    expect(handler.policyPrincipalId).to.be.equal(principalId);
  });

  it('should return policy context that will be passed to backend', () => {
    expect(handler.policyContext).to.be.eql(tokenPayload);
  });

  it('should return fullfill promise for "validate" method', () => {
    return expect(handler.validate()).to.be.fulfilled;
  });
});
