const {expect} = require('chai');
const createAllowPolicy = require('../../lib/policy');

describe('lib/auth/policy', () => {
  describe('Allow policy', () => {
    it('should throw if "principalId" is not passed', () => {
      expect(() => createAllowPolicy({})).to.throw(/principalId/);
    });
    it('should throw if "arn" id is not passed', () => {
      expect(() => createAllowPolicy({principalId: 1})).to.throw(/arn/);
    });

    it('should return allow policy', () => {
      expect(createAllowPolicy({principalId: 1, arn: 'my_arn'})).to.eql({
        context: {},
        policyDocument: {
          Statement: [{
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: 'my_arn',
          }],
          Version: '2012-10-17',
        },
        principalId: 1,
      });
    });

    it('should return allow policy with context', () => {
      const policy = createAllowPolicy({principalId: 1, arn: 'my_arn', context: {a: 1, b: 2}});

      expect(policy).have.deep.property('context', {
        a: 1,
        b: 2,
      });
    });
  });
});
