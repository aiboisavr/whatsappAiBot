"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const twilio_1 = require("./twilio");
function whatsappHandler(incoming) {
    (0, twilio_1.sendMessage)(incoming.From, incoming.To, "Welcome Bitch");
}
exports.default = whatsappHandler;
