const awsSvc = require("../services/awsService.js");
const config = require("../config.js");

module.exports = {

  sendReminderEmail: async (reminder) => {

    const { username, body } = reminder;

    const queryResp = await awsSvc.dynamodb.queryItems(
      config.subscriptionsTableName,
      "#id = :value",
      { "#id": "username" },
      { ":value": username }
    );

    const subscriptions = queryResp.Items[0];

    if (subscriptions.email && subscriptions.email.length > 0) {

      subscriptions.email.forEach(async email => {

        const templateData = {
          username,
          reminderBody: body
        };

        await awsSvc.sqs.sendMessage(config.emailQueueUrl, JSON.stringify({
          type: "SEND_REMINDER",
          recipientEmail: email,
          parameters: templateData
        }));
      });
    }
  }
}