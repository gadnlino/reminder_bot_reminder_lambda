const awsSvc = require("./services/awsService.js");
const helpers = require("./helpers/helpers.js");
const dotenv = require("dotenv");

dotenv.config();

module.exports = async (event, context) => {
    const { REMINDERS_BOT_TABLE, REMINDERS_QUEUE_URL, PERSISTENCE_QUEUE_URL } = process.env;

    return new Promise(async (_, __) => {

        console.log(JSON.stringify(event));

        const { uuid, rule_name } = event;

        console.log("Sending reminder with id = " + uuid);

        try {
            const queryResp = await awsSvc.
                dynamodb.queryItems(REMINDERS_BOT_TABLE, "#uuid = :id",
                    { "#uuid": "uuid" }, { ":id": uuid });

            const reminder = queryResp.Items[0];

            //Send message to SQS notification queue that`s been monitored by the bot
            const sendMessageResp = await awsSvc.sqs
                .sendMessage(REMINDERS_QUEUE_URL, JSON.stringify(reminder));

            const listTargetsResp = await awsSvc.cloudWatchEvents
                .listTargets(rule_name);

            const targetIds = listTargetsResp.Targets.map(t => t.Id);

            if (targetIds.length > 0) {
                const removeTargetsResp = await awsSvc
                    .cloudWatchEvents.removeTargets(targetIds, rule_name);
            }

            const deleteRuleResp = await awsSvc.cloudWatchEvents
                .deleteRule(rule_name);

            //Check if the user has email subscription, and, if so, sends a email notif
            helpers.sendReminderEmail(reminder);

            //Sends the reminder to deletion
            const body = { "uuid": uuid };
            await awsSvc.sqs.sendMessage(PERSISTENCE_QUEUE_URL, JSON.stringify(body));
        }
        catch (e) {
            console.error(e.message);
        }
    });
}