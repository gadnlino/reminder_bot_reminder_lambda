const AWS = require("aws-sdk");
const region = "us-east-1";
const sqs = new AWS.SQS({ region });
const docClient = new AWS.DynamoDB.DocumentClient({ region });

exports.handler = async (event, context) => {

    const tableName = process.env.REMINDERS_BOT_TABLE || `reminder_bot_reminders`;

    return new Promise((resolve, reject) => {

        const date = `${new Date().toISOString().split("T")[0]}T00:00:00.000Z`;

        const queryParams = {
            TableName: tableName,
            FilterExpression: "#yr = :date and #flag = :done",
            ExpressionAttributeNames: {
                "#yr": "reminder_date",
                "#flag": "dismissed"
            },
            ExpressionAttributeValues: {
                ":date": date,
                ":done": false
            }
        };

        docClient.scan(queryParams, (err, data) => {

            if (err) {
                reject(err);
            }
            else {
                console.log(data);

                const queueURL = process.env.REMINDERS_QUEUE_URL || 
                    `https://sqs.us-east-1.amazonaws.com/702784444557/sqs-reminders`;

                data.Items.forEach(function (reminder) {

                    const params = {
                        QueueUrl: queueURL,
                        MessageBody: JSON.stringify(reminder)
                    };

                    sqs.sendMessage(params,(err,data)=>{
                        if(err){
                            reject(err);
                        }
                        else{
                            console.log(data);
                        }
                    });
                });

                resolve();
            }
        });
    });
};

