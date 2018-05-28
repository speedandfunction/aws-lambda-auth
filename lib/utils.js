const joinPath = require('path').join;
const _ = require('lodash');

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

function extractTokenFromEvent(event = {}) {
  const tokenString = _.get(event, 'headers.Authorization');

  if (!tokenString) {
    throw new Error(`Expected "Authorization" header to be set. Event:\n${JSON.stringify(event)}`);
  }

  const tokenMatch = tokenString.match(/^Bearer (.*)$/);

  if (!tokenMatch) {
    throw new Error(`Invalid authorization token - "${tokenString}" does not match "Bearer .*"`);
  }

  const [, token] = tokenMatch;

  return token;
}


module.exports = {
  buildExecutionApiArn,
  extractTokenFromEvent,
};
