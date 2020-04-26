const region = "us-east-1";

const AWS = require("aws-sdk");
const sqs = new AWS.SQS({ region });
const docClient = new AWS.DynamoDB.DocumentClient({ region });
const cwevents = new AWS.CloudWatchEvents({ region });
const lambda = new AWS.Lambda({ region });

module.exports = {
    sqs: {
        sendMessage: async (queueURL, body) => {

            const params = {
                QueueUrl: queueURL,
                MessageBody: body
            };

            const req = sqs.sendMessage(params);

            return req.promise();
        },
        getMessages: async (queueURL) => {

            const params = {
                QueueUrl: queueURL
            };

            const req = sqs.receiveMessage(params);

            return req.promise();
        }
    },

    dynamodb: {
        putItem: async (tableName, item) => {

            const params = {
                TableName: tableName,
                Item: item
            };

            const req = docClient.put(params);

            return req.promise();
        },
        
        queryItem : async (TableName, KeyConditionExpression, 
                ExpressionAttributeNames, ExpressionAttributeValues)=>{
            const params = {
                TableName,
                KeyConditionExpression,
                ExpressionAttributeNames,
                ExpressionAttributeValues
            };

            const req = docClient.query(params);

            return req.promise();
        },

        queryItems: async (TableName,
            FilterExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues) => {

            const params = {
                TableName,
                FilterExpression,
                ExpressionAttributeNames,
                ExpressionAttributeValues
            };

            const req = docClient.scan(params);

            return req.promise();
        },
        updateItem: async (TableName,
            Key,
            UpdateExpression,
            ExpressionAttributeValues,
            ReturnValues) => {

            const params = {
                TableName,
                Key,
                UpdateExpression,
                ExpressionAttributeValues,
                ReturnValues
            };

            const req = docClient.update(params);

            return req.promise();
        }
    },
    cloudWatchEvents: {
        putRule: async (Name, ScheduleExpression, State) => {

            const params = {
                Name,
                ScheduleExpression,
                State
            };

            const req = cwevents.putRule(params);

            return req.promise();
        },

        deleteRule : async (Name)=>{

            const params = {
                Name
            };

            const req = cwevents.deleteRule(params);

            return req.promise();
        },

        describeRule : async (Name)=>{

            const params = {
                Name
            };

            const req = cwevents.describeRule(params);

            return req.promise();
        },

        putTargets : async (Rule, Targets)=>{

            const params = {
                Rule,
                Targets
            };

            const req = cwevents.putTargets(params);

            return req.promise();
        },

        listTargets : async (Rule) =>{

            const params = {
                Rule
            };

            const req = cwevents.listTargetsByRule(params);

            return req.promise();
        },

        removeTargets : async (Ids, Rule)=>{

            const params = {
                Ids,
                Rule
            };

            const req = cwevents.removeTargets(params);

            return req.promise();
        }
    },
    lambda: {
        addPermission: async (Action, FunctionName, Principal, SourceArn, StatementId) => {

            var params = {
                Action,
                FunctionName,
                Principal,
                SourceArn,
                StatementId
            };

            const req = lambda.addPermission(params);

            return req.promise();
        }
    }
};