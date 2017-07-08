const moment = require('moment');
const config = require('./config');
const dialogActions = require('./utils/dialogActions');
const github = require('./utils/github');

function handler(event, context, callback) {
  const repository = event.sessionAttributes.Repository;

  github.login(config.GITHUB_USERNAME, config.GITHUB_PASSWORD)
    .then((token) => {
      github.get(token, `/repos/${repository}/commits`)
        .then((result) => {

          //  If it looks like we've got a bad response, or no commits, bail.
          if (!result.body || !result.body[0] || !result.body[0].commit) {
            return callback(null, dialogActions.close(event.sessionAttributes, 'Fulfilled', {
              contentType: 'PlainText',
              content: `I'm sorry, I can't find the commits on ${repository}.`
            }));
          }

          //  Create the response.
          const commit = result.body[0];
          const author = commit.author.login;
          const message = commit.commit.message;
          const date = commit.commit.author.date;
          const fromNow = moment(date).fromNow();

          const response = `The last commit on ${repository} was by ${author} ${fromNow} with the message '${message}'`;
          return callback(null, dialogActions.close(event.sessionAttributes, 'Fulfilled', {
            contentType: 'PlainText',
            content: response
          }));
        });
    });
}

module.exports = {
  handler
};
