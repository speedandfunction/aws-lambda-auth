const {expect} = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const proxyquireStrict = proxyquire.noCallThru();

describe('lib/middlewares/kms', () => {
  const sandbox = sinon.createSandbox();
  let decryptStub;
  let kmsMiddleware;
  let decryptedResultStub;

  beforeEach(() => {
    decryptStub = sandbox.stub();
    decryptedResultStub = {Plaintext: {toString: sandbox.stub()}};

    const kms = proxyquireStrict('../../../lib/middlewares/kms', {
      'aws-sdk': {
        KMS: sandbox.stub().returns({
          decrypt: decryptStub,
        }),
      },
    });

    kmsMiddleware = kms(['TEST_ENV']);
  });

  afterEach(() => {
    delete process.env.TEST_ENV;

    sandbox.restore();
  });

  it('should decrypt venv', async () => {
    process.env.TEST_ENV = 'encripted_data';

    const promise = kmsMiddleware({});

    decryptStub.invokeCallback(null, decryptedResultStub);

    await promise;

    expect(decryptStub).have.been.calledWith({
      CiphertextBlob: Buffer.from('encripted_data', 'base64'),
    });
  });

  it('should decrypt via "ascii" encoding', async () => {
    process.env.TEST_ENV = 'not_null_data';

    const promise = kmsMiddleware({});

    decryptStub.invokeCallback(null, decryptedResultStub);

    await promise;

    return expect(decryptedResultStub.Plaintext.toString)
      .have.been.calledWithExactly('ascii');
  });

  it('should extend context via decrypted env', () => {
    process.env.TEST_ENV = 'not_null_data';

    const promise = kmsMiddleware({data: 'ctx'});

    decryptedResultStub.Plaintext.toString.returns('decrypted');
    decryptStub.invokeCallback(null, decryptedResultStub);

    return expect(promise).become({
      data: 'ctx',
      kms: {TEST_ENV: 'decrypted'},
    });
  });
});
