const P = require('bluebird');

const createAllowPolicy = ('../policy');
const logger = ('../logger');

export default class SingleAuthFlow {
  constructor({lambdaEvent = {}, lambdaCtx = {}, tokenPayload = {}} = {}) {
    logger.log(JSON.stringify({lambdaEvent}, null, 2));

    this._lambdaCtx = lambdaCtx;
    this._lambdaEvent = lambdaEvent;
    this._tokenPayload = tokenPayload;
    this._handler = null;
  }

  addHandler(Handler) {
    this._handler = new Handler({
      lambdaCtx: this._lambdaCtx,
      lambdaEvent: this._lambdaEvent,
      tokenPayload: this._tokenPayload,
    });

    return this;
  }

  async createPolicy() {
    try {
      await this._validateHandler();

      const authPolicy = this._createAllowPolicy();
      const handler = this._getHandler();

      logger.log(JSON.stringify({
        message: `[FLOW:${handler.name}] Generate allow policy`,
        data: authPolicy,
      }));

      return authPolicy;
    } catch (e) {
      const handler = this._getHandler();
      const error = e.stack || JSON.stringify(e);
      const msg = handler
        ? `[FLOW:${handler.name}] Error occurred during creating the policy`
        : 'Error occurred during creating the policy';

      logger.log(JSON.stringify({
        message: msg,
        stack: error,
      }));

      return P.reject('Unauthorized');
    }
  }

  _getHandler() {
    if (!this._handler) {
      throw new Error('Handler was not defined through "addHandler" method');
    }

    return this._handler;
  }

  _validateHandler() {
    const handler = this._getHandler();

    return handler.prepare();
  }

  _createAllowPolicy() {
    const handler = this._getHandler();

    return createAllowPolicy({
      arn: handler.policyArn,
      principalId: handler.policyPrincipalId,
      context: handler.policyContextcontext,
    });
  }
}
