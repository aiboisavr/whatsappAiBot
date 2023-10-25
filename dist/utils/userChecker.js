"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentPlans = void 0;
const state_1 = require("../utils/state");
const user_model_1 = __importDefault(require("../models/user.model"));
const mesaages_1 = require("../utils/mesaages");
const paymentHandler_1 = require("../controllers/paymentHandler");
const twilio_1 = require("../controllers/twilio");
exports.paymentPlans = {
    "Starter": {
        amount: 10,
        credits: 10
    },
    "Basic": {
        amount: 50,
        credits: 75
    },
    "Pro": {
        amount: 100,
        credits: 150
    }
};
function userChecker(incoming) {
    return __awaiter(this, void 0, void 0, function* () {
        const isExistingUser = yield user_model_1.default.findOne({ phoneNumber: incoming.From });
        if (!isExistingUser) {
            const user = yield user_model_1.default.create({
                phoneNumber: incoming.From
            });
            console.log(`New user created with phone Number: ${user.phoneNumber} with ${user.credits} credits remaining.`);
            yield (0, twilio_1.sendMessage)(incoming.From, incoming.To, (0, mesaages_1.getReplyMessage)('Dehidden'));
            yield new Promise(resolve => setTimeout(resolve, 1000));
            yield (0, twilio_1.sendMessage)(incoming.From, incoming.To, (0, mesaages_1.getReplyMessage)('welcomeMessageNew'));
            yield new Promise(resolve => setTimeout(resolve, 1000));
            yield (0, twilio_1.sendMessage)(incoming.From, incoming.To, (0, mesaages_1.getReplyMessage)('createHelp'));
            // return `${getReplyMessage('welComeMessage',0)}.\n Please type the command Generate to proceed`
            return "";
        }
        else {
            if (isExistingUser.newUser) {
                yield (0, twilio_1.sendMessage)(incoming.From, incoming.To, (0, mesaages_1.getReplyMessage)('Dehidden'));
                yield new Promise(resolve => setTimeout(resolve, 1000));
                yield (0, twilio_1.sendMessage)(incoming.From, incoming.To, (0, mesaages_1.getReplyMessage)('welcomeMessageNew'));
                yield new Promise(resolve => setTimeout(resolve, 1000));
                yield (0, twilio_1.sendMessage)(incoming.From, incoming.To, (0, mesaages_1.getReplyMessage)('createHelp'));
            }
            else if (incoming.Body === "Starter" || incoming.Body === "Basic" || incoming.Body === "Pro") {
                let paymentLink;
                const phoneNumber = isExistingUser.phoneNumber.split(':')[1];
                const paymentLinkParams = {
                    phoneNumber: phoneNumber,
                    amount: exports.paymentPlans[incoming.Body].amount * 100,
                    referenceId: `${phoneNumber}_${new Date().getTime()}_${incoming.Body}`
                };
                try {
                    paymentLink = yield (0, paymentHandler_1.generatePaymentLink)(paymentLinkParams);
                    return `Great choice! The ${incoming.Body} pack looks perfect for you.\n\nPlease use the link below to complete payment within the next 10 minutes.\n${paymentLink}`;
                }
                catch (e) {
                    console.log(`PaymentLink error${e}`);
                }
            }
            else if (isExistingUser.credits == 0) {
                return `${(0, mesaages_1.getReplyMessage)('insufficientCredits')}`;
            }
            else {
                return `${(0, mesaages_1.getReplyMessage)('creditBalance', isExistingUser.credits)}`;
            }
        }
        yield (0, state_1.setStage)(incoming.From);
        console.log(yield (0, state_1.getStage)(incoming.From));
    });
}
exports.default = userChecker;
