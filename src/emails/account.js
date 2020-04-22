const sgMail = require("@sendgrid/mail");
const API_KEY =process.env.SENDGRID_API_KEY;

sgMail.setApiKey(API_KEY)

const sendWelcomeEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'guruprasadbv4648@gmail.com',
        subject:'Thanks for joining in',
        text:`Welcome to the App ${name}. Let me know how you get along with the app`
    })
}


const sendAccountDeleteEmail=(email,name)=>{
    sgMail
      .send({
        to: email,
        from: "guruprasadbv4648@gmail.com",
        subject: "We will miss you",
        text: `We are sorry to see you go.We wish we could keep you longer ${name}`,
      })
}

module.exports = {
  sendWelcomeEmail,
  sendAccountDeleteEmail,
};