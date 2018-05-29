const joinPath = require('path').join;

const buildExecutionApiArn = ({
  region = '*',
  acountId = '*',
  appId = '*',
  stage = '*',
  method = '*',
  path = '*',
} = {}) => {
  const methodWithPath = joinPath(method, path);

  return `arn:aws:execute-api:${region}:${acountId}:${appId}/${stage}/${methodWithPath}`;
};

module.exports = {
  buildExecutionApiArn,
};
