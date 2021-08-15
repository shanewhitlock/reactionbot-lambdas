const { WebClient } = require('@slack/web-api');

let getResponseForReaction = (reaction) => {
    switch(reaction) {
        case "grinning": {
            return "What are you so happy about?"
        }
        case "eyes": {
            return "What are you looking at?"
        }
        default: {
            return null;
        }
    }
}

// Verify Url - https://api.slack.com/events/url_verification
let verify = (data, callback) => {
    callback(null, data.challenge);
};

// Post message to Slack - https://api.slack.com/methods/chat.postMessage
let processMessage = async (event, callback) => {
    if (!event.bot_id) {
        let messageText = getResponseForReaction(event.reaction);
        if(messageText) {
            const web = new WebClient(process.env.SLACK_TOKEN);
            await web.chat.postMessage({
              thread_ts: event.item.ts,
              channel: '#general',
              text: messageText,
            });
        }
    }

    callback(null);
};

exports.handler = (reqData, context, callback) => {
    let data = JSON.parse(reqData.body);
    switch (data.type) {
        case "url_verification": verify(data, callback); break;
        case "event_callback": processMessage(data.event, callback); break;
        default: callback(null);
    }
};