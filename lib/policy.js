module.exports = ({principalId, arn, context = {}}) => {
  if (!principalId) {
    throw new Error('"principalId" is required param');
  }

  if (!arn) {
    throw new Error('"arn" is required param');
  }

  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: 'Allow',
        Resource: arn,
      }],
    },
    context,
  };
};
