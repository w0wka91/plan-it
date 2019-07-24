import * as functions from "firebase-functions";
import { createTransport } from "nodemailer";
import * as mg from "nodemailer-mailgun-transport";

export const updatePollCreator = functions.firestore
  .document("polls/{pollID}/votes/{voteID}")
  .onWrite((change, context) => {
    const auth = {
      auth: {
        api_key: functions.config().mailgun.apikey,
        domain: functions.config().mailgun.domain
      }
    };

    const nodemailerMailgun = createTransport(mg(auth));

    nodemailerMailgun.sendMail(
      {
        from: "myemail@example.com",
        to: "waldemar.penner91@gmail.com", // An array if you have multiple recipients.
        subject: "Hey you, awesome!",
        //You can use "html:" to send HTML email content. It's magic!
        html: "<b>Wow Big powerful letters</b>",
        //You can use "text:" to send plain-text content. It's oldschool!
        text: "Mailgun rocks, pow pow!"
      },
      function(err, info) {
        if (err) {
          console.log("Error: " + err);
        } else {
          console.log("Response: " + info);
        }
      }
    );
  });
