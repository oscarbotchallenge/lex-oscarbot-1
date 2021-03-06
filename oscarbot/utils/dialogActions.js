// --------------- Helpers to build responses which match the structure of the necessary dialog actions -----------------------

function elicitSlot(sessionAttributes, intentName, slots, slotToElicit, message, responseCard) {
  return {
    sessionAttributes,
    dialogAction: {
      type: 'ElicitSlot',
      intentName,
      slots,
      slotToElicit,
      message,
      responseCard,
    },
  };
}

function confirmIntent(sessionAttributes, intentName, slots, message, responseCard) {
  return {
    sessionAttributes,
    dialogAction: {
      type: 'ConfirmIntent',
      intentName,
      slots,
      message,
      responseCard,
    },
  };
}

function close(sessionAttributes, fulfillmentState, message, responseCard) {
  return {
    sessionAttributes,
    dialogAction: {
      type: 'Close',
      fulfillmentState,
      message,
      responseCard,
    },
  };
}

function delegate(sessionAttributes, slots) {
  return {
    sessionAttributes,
    dialogAction: {
      type: 'Delegate',
      slots,
    },
  };
}

// Build a responseCard with a title, subtitle, and an optional set of options which should be displayed as buttons.
function buildResponseCard(title, subTitle, options) {
  let buttons = null;
  if (options != null) {
    buttons = [];
    for (let i = 0; i < Math.min(5, options.length); i++) {
      buttons.push(options[i]);
    }
  }
  return {
    contentType: 'application/vnd.amazonaws.card.generic',
    version: 1,
    genericAttachments: [{
      title,
      subTitle,
      buttons,
    }],
  };
}

module.exports = {
  elicitSlot,
  confirmIntent,
  close,
  delegate,
  buildResponseCard,
};
