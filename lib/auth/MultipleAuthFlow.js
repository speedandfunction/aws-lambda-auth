const _ = require('lodash');

const SingleAuthFlow = require('./SingleAuthFlow');

module.exports = class MultipleAuthFlow extends SingleAuthFlow {
  addHandler(Handler, predicate) {
    if (!_.isFunction(predicate)) {
      throw new Error('Predicate is required and must be "Function"');
    }

    if (!predicate({tokenPayload: this._tokenPayload, lambdaEvent: this._lambdaEvent})) {
      return this;
    }

    if (this._handler) {
      throw new Error('Handler was already defined. Check your predicates');
    }

    this._handler = new Handler({
      lambdaCtx: this._lambdaCtx,
      lambdaEvent: this._lambdaEvent,
      tokenPayload: this._tokenPayload,
    });

    return this;
  }
}
