"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = void 0;
const twilio_1 = require("twilio");
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = new twilio_1.Twilio(accountSid, authToken);
const sendMessage = (to, from, body) => {
    return new Promise((resolve, reject) => {
        client.messages
            .create({
            to,
            from,
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
exports.sendMessage = sendMessage;
