const objectHash = require('object-hash');

module.exports = class AuthHandler {
  constructor({lambdaEvent, lambdaCtx, tokenPayload} = {}) {
    this._lambdaEvent = lambdaEvent;
    this._lambdaCtx = lambdaCtx;
    this._tokenPayload = tokenPayload;
  }

  get name() {
    throw new Error('Method must be implemented');
  }

  get policyArn() {
    throw new Error('Method must be implemented');
  }

  get policyPrincipalId() {
    return objectHash.MD5(this._tokenPayload);
  }

  get policyContext() {
    return this._tokenPayload;
  }

  async validate() {
  }
};
