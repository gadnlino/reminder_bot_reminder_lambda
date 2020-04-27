const awsSvc = require("./services/awsService.js");
/*const dotenv = require("dotenv");

dotenv.config();*/

exports.handler = async (event, context) => {

    const {REMINDERS_BOT_TABLE, REMINDERS_QUEUE_URL} = process.env;    

    return new Promise(async (_, __) => {        
        
        const {uuid, creation_date, rule_arn, rule_name} = event;

        const queryResp = await awsSvc.
                dynamodb.queryItem(REMINDERS_BOT_TABLE, "#uuid = :id",
                                    {"#uuid" : "uuid"}, {":id" : uuid});
        
        const reminder = queryResp.Items[0];

        const sendMessageResp = await awsSvc.sqs
            .sendMessage(REMINDERS_QUEUE_URL, JSON.stringify(reminder));

        const listTargetsResp = await awsSvc.cloudWatchEvents.listTargets(rule_name);
        
        const targetIds = listTargetsResp.Targets.map(t=>t.Id);
        
        if(targetIds.length > 0){
            const removeTargetsResp = await awsSvc
                            .cloudWatchEvents.removeTargets(targetIds, rule_name);
        }

        const deleteRuleResp = await awsSvc.cloudWatchEvents
                                .deleteRule(rule_name);
    });
};

