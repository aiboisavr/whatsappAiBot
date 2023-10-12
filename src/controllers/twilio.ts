import { Twilio } from "twilio";
const accountSid = process.env.ACCOUNT_SID!;
const authToken = process.env.AUTH_TOKEN!;

const client = new Twilio(accountSid, authToken);

export const sendMessage = (to: string, from: string, body?: string,mediaUrl?:string[]) => {
  return new Promise((resolve, reject) => {
    client.messages
      .create({
        to,
        from,
        mediaUrl,
        body
      })
      .then(message => {
        resolve(message.sid);
      })
      .catch(error => {
        reject(error);
      });
  });
};