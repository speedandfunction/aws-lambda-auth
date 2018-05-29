const AWS = require('aws-sdk');
const P = require('bluebird');
const _ = require('lodash');

const kms = new AWS.KMS({region: process.env.AWS_REGION});
const decrypt = P.promisify(kms.decrypt, {context: kms});

let venv;

module.exports = function middleware(vars) {
  return async (ctx) => {
    // Decrypt code should run once and variables stored outside of the function
    // handler so that these are decrypted once per container
    if (!venv) {
      venv = await decryptVenvs(vars);
    }

    ctx.kms = venv;

    return ctx;
  };
};

function decryptVenvs(vars) {
  return P
    .all(vars.map(decryptVenv))
    .then(_.fromPairs);
}

function decryptVenv(key) {
  const val = process.env[key];

  if (!val) {
    throw new Error(`There is no value for env ${key}`);
  }

  return decrypt({CiphertextBlob: Buffer.from(val, 'base64')})
    .then((data) => ([key, data.Plaintext.toString('ascii')]));
}
