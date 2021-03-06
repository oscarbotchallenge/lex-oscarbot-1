const assert = require('assert');
const { handler } = require('../index');
const openIssue = require('./tests/open-issue.json');
const openIssueWithTitle = require('./tests/open-issue-with-title.json');
const openIssueWithSlots = require('./tests/open-issue-with-slots.json');

describe('intentOpenIssue', () => {
  it('should ask for an issue title if one isn\'t provided', (done) => {
    handler(openIssue, null, (err, response) => {
      assert.equal(response.dialogAction.type, 'ElicitSlot');
      assert.equal(response.dialogAction.slotToElicit, 'IssueTitle');
      assert(response.dialogAction.message.content.match(/title/));
      done();
    });
  });

  it('should ask for issue content if none is provided', (done) => {
    handler(openIssueWithTitle, null, (err, response) => {
      assert.equal(response.dialogAction.type, 'ElicitSlot');
      assert.equal(response.dialogAction.slotToElicit, 'IssueContent');
      assert(response.dialogAction.message.content.match(/description/));
      done();
    });
  });

  //  This is disabled by default otherwise we get lots of issues added to the repo.
  xit('should be able to open an issue', (done) => {

    //  Take the test event, and set its confirmation status.
    const event = Object.assign({}, openIssueWithSlots);
    event.currentIntent.confirmationStatus = 'Confirmed';

    handler(event, null, (err, response) => {
      assert.equal(response.dialogAction.type, 'Close');
      assert(response.dialogAction.message.content.match(/issue is now open/));
      done();
    });
  });
});
