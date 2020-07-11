const awsSvc = require("./services/awsService.js");
const helpers = require("./helpers/helpers.js");
const config = require("./config.js");

module.exports = async (event, context) => {

    return new Promise(async (_, __) => {

        console.log(JSON.stringify(event));

        const { uuid, rule_name } = event;

        console.log("Sending reminder with id = " + uuid);

        try {
            const queryResp = await awsSvc.
                dynamodb.queryItems(config.remindersTableName, "#uuid = :id",
                    { "#uuid": "uuid" }, { ":id": uuid });

            const reminder = queryResp.Items[0];

            //Send message to SQS notification queue that`s been monitored by the bot
            await awsSvc.sqs
                .sendMessage(config.remindersQueueUrl, JSON.stringify(reminder));

            const listTargetsResp = await awsSvc.cloudWatchEvents
                .listTargets(rule_name);

            const targetIds = listTargetsResp.Targets.map(t => t.Id);

            if (targetIds.length > 0) {
                await awsSvc
                    .cloudWatchEvents.removeTargets(targetIds, rule_name);
            }

            await awsSvc.cloudWatchEvents.deleteRule(rule_name);

            //Check if the user has email subscription, and, if so, sends a email notif
            helpers.sendReminderEmail(reminder);

            //Sends the reminder to deletion
            await awsSvc.sqs.sendMessage(config.persistenceQueueUrl, JSON.stringify({ "uuid": uuid }));
        }
        catch (e) {
            console.error(e.message);
        }
    });
}