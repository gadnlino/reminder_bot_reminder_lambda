const dotenv = require("dotenv");
dotenv.config();

const {
    AWS_REGION,
    REMINDERS_BOT_TABLE,
    SUBSCRIPTIONS_TABLE,
    REMINDERS_QUEUE_URL,
    PERSISTENCE_QUEUE_URL,
    EMAIL_QUEUE_URL,
    REMINDERS_LAMBDA_ARN,
    REMINDERS_LAMBDA_NAME
} = process.env;

module.exports = {
    awsRegion: AWS_REGION,
    remindersTableName: REMINDERS_BOT_TABLE,
    subscriptionsTableName: SUBSCRIPTIONS_TABLE,
    remindersQueueUrl: REMINDERS_QUEUE_URL,
    persistenceQueueUrl: PERSISTENCE_QUEUE_URL,
    emailQueueUrl: EMAIL_QUEUE_URL,
    remindersLambdaArn: REMINDERS_LAMBDA_ARN,
    remindersLambdaName: REMINDERS_LAMBDA_NAME
};