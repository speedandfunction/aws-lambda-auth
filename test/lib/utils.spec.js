const {expect} = require('chai');
const {buildExecutionApiArn} = require('../../lib/utils');

describe('lib/utils.buildExecutionApiArn', () => {
  it('should return default arn', () => {
    expect(buildExecutionApiArn()).to.equal('arn:aws:execute-api:*:*:*/*/*/*');
  });

  it('should return arn by passed params', () => {
    const params = {
      region: 'reg',
      acountId: 'acId',
      appId: 'appid',
      stage: 'stage',
      method: 'method',
      path: 'some/path',
    };

    expect(buildExecutionApiArn(params))
      .to.equal('arn:aws:execute-api:reg:acId:appid/stage/method/some/path');
  });
});
