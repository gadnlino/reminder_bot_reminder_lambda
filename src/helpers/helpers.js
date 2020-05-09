const dotenv = require("dotenv");
dotenv.config();

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
    sendEmail: async () => {
        const msg = {
            to: 'gadnlino@gmail.com',
            from: 'guiavenas@gmail.com',
            templateId: process.env.SENDGRID_REMINDER_TEMPLATE_ID,
            dynamic_template_data: {
              username: "gadnlino",
              reminderBody: "Teste a partir do Node.js"
            }
          };

        sgMail.send(msg);
    }
}