const {expect} = require('chai');
const sinon = require('sinon');
const lambda = require('../../lib/lambda');

describe('lib/lambda/index', () => {
  let lambdaFunction;

  beforeEach(() => {
    lambdaFunction = sinon.stub().resolves();
  });

  it('should call original lambda function', (done) => {
    const lambdaEvent = {data: 'event'};
    const lambdaContext = {data: 'ctx'};

    lambda(lambdaFunction)(lambdaEvent, lambdaContext, (err) => {
      expect(err).to.be.a('null');
      expect(lambdaFunction).have.been.calledWithExactly({lambdaEvent, lambdaContext});

      done();
    });
  });

  it('should run middlewares sequentially', (done) => {
    const lambdaContext = {data: 'ctx'};
    const middleware1 = sinon.stub().resolves('1');
    const middleware2 = sinon.stub().resolves('2');

    lambda(lambdaFunction, [middleware1, middleware2])(null, lambdaContext, (err) => {
      expect(err).to.be.a('null');
      expect(middleware1).have.been.calledBefore(middleware2);
      expect(lambdaFunction).have.been.calledWith(sinon.match({lambdaContext: '2'}));

      done();
    });
  });

  it('should call cb with error if some of middlewares throw', (done) => {
    const middleware1 = sinon.stub().rejects();

    lambda(lambdaFunction, [middleware1])(null, null, (err) => {
      expect(err).to.be.instanceof(Error);

      done();
    });
  });

  it('should call cb with result of original lambda ', (done) => {
    lambdaFunction.resolves('result');

    lambda(lambdaFunction)(null, null, (err, res) => {
      expect(err).to.be.a('null');
      expect(res).to.equal('result');

      done();
    });
  });

  it('should call cb with error if original lambda throw', (done) => {
    lambdaFunction.rejects();

    lambda(lambdaFunction)(null, null, (err) => {
      expect(err).to.be.instanceOf(Error);

      done();
    });
  });
});
