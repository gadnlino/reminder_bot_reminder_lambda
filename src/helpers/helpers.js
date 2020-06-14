const dotenv = require("dotenv");
dotenv.config();

const sgSvc = require("../services/sendgridService.js");
const awsSvc = require("../services/awsService.js");

module.exports = {

  sendReminderEmail: async (reminder) => {

    const { SENDGRID_REMINDER_TEMPLATE_ID, SERVICE_EMAIL, SUBSCRIPTIONS_TABLE } = process.env;
    const { username, body } = reminder;

    const queryResp = await awsSvc.dynamodb.queryItems(
      SUBSCRIPTIONS_TABLE,
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

        const response = await sgSvc.sendMail(
          email,
          SERVICE_EMAIL,
          SENDGRID_REMINDER_TEMPLATE_ID,
          templateData
        );

        if(response[0].statusCode <= 299 && response[0].statusCode >= 200){
          console.log("Email sent!");
        }
      });
    }
  }

  
}