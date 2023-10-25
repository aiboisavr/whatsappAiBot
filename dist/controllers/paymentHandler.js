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
exports.handlePaymentFailed = exports.handleOrderPaid = exports.generatePaymentLink = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const user_model_1 = __importDefault(require("../models/user.model"));
const twilio_1 = require("./twilio");
const userChecker_1 = require("../utils/userChecker");
const mesaages_1 = require("../utils/mesaages");
var instance = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
});
//console.log(instance)
function generatePaymentLink(paymentDetails) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const paymentLink = yield instance.paymentLink.create({
                reference_id: paymentDetails.referenceId,
                amount: paymentDetails.amount,
                currency: "INR",
                description: "Subscription",
                customer: {
                    name: `${paymentDetails.phoneNumber}_user`,
                    email: "",
                    contact: paymentDetails.phoneNumber
                }
            });
            console.log(paymentLink);
            return paymentLink === null || paymentLink === void 0 ? void 0 : paymentLink.short_url;
        }
        catch (e) {
            console.log(`Error while trying to create paymentLink::${JSON.stringify(e)}`);
        }
    });
}
exports.generatePaymentLink = generatePaymentLink;
function handleOrderPaid(orderResponse) {
    return __awaiter(this, void 0, void 0, function* () {
        const userPhoneNumber = `whatsapp:${orderResponse.receipt.split('_')[0]}`;
        const userPlan = orderResponse.receipt.split('_')[2];
        const creditsPurchased = userChecker_1.paymentPlans[userPlan].credits;
        const user = yield user_model_1.default.findOneAndUpdate({ phoneNumber: userPhoneNumber }, { $inc: { credits: creditsPurchased } }, { new: true });
        (0, twilio_1.sendMessage)(userPhoneNumber, process.env.TWILIO_PHONE_NUMBER, `Congrats, your payment is successful! The ${userPlan} pack is now activated! ✅\nYou have now ${user === null || user === void 0 ? void 0 : user.credits} Photo Credits remaining\n\nStart creating new photos of your product now! 📸`);
    });
}
exports.handleOrderPaid = handleOrderPaid;
function handlePaymentFailed(paymentFailedResponse) {
    return __awaiter(this, void 0, void 0, function* () {
        const referenceId = paymentFailedResponse.reference_id;
        const userPhoneNumber = `whatsapp:${referenceId.split('_')[0]}`;
        (0, twilio_1.sendMessage)(userPhoneNumber, process.env.TWILIO_PHONE_NUMBER, (0, mesaages_1.getReplyMessage)('paymentError'));
    });
}
exports.handlePaymentFailed = handlePaymentFailed;
