const config = require('../config');
const dialogActions = require('../utils/dialogActions');
const elicitSlot = require('../utils/dialog/elicitSlot');
const github = require('../utils/github');
const i18n = require('../i18n');

function handler(event, context, callback) {
  const gitHubUsername = event.currentIntent.slots.GitHubUsername;

  //  Elicit the required slots.
  if (!gitHubUsername) return elicitSlot(event, 'GitHubUsername', i18n('elicitSlotGitHubUser'), callback);

  github.login(config.GITHUB_USERNAME, config.GITHUB_PASSWORD, event)
    .then((token) => {
      github.query(token, `
        query {
          search(first:3 query: "stars:>1 user:${gitHubUsername}", type:REPOSITORY) {
            edges {
              node {
                ... on Repository {
                  name
                  stargazers { totalCount}
                }
              }
            }
          }
        }`)
        .then((result) => {

          const data = JSON.parse(result).data;
          const repos = data.search.edges;
          const myTopThreeRepos = repos.map((n) => { return { name: n.node.name, stars: n.node.stargazers.totalCount }; });
          const list = myTopThreeRepos.map(r => ` - ${r.name} (${r.stars} stars)`).join('\n');

          const response = i18n('whatAreMyMostPopularProjectsResponse', {
            list
          });

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
