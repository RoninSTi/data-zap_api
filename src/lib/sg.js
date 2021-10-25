const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendTemplateEmail = ({ to, templateId, dynamicTemplateData }) => {
  const msg = {
    to: to,
    from: "craig.cronin@gmail.com",
    templateId,
    dynamicTemplateData,
  };

  sgMail.send(msg);
};

module.exports = {
  sendTemplateEmail,
};
