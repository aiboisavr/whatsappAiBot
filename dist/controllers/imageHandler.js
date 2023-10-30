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
const twilio_1 = require("./twilio");
const mesaages_1 = require("../utils/mesaages");
const user_model_1 = __importDefault(require("../models/user.model"));
function ImageHandler(userId, Body) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(userId);
        console.log(Body);
        const formattedUserId = `whatsapp:+${userId.split(":")[1].trim()}`;
        const mediaUrl = Body.image_url;
        const user = yield user_model_1.default.findOne({ phoneNumber: formattedUserId });
        if (process.env.TWILIO_PHONE_NUMBER) {
            if (user === null || user === void 0 ? void 0 : user.newUser) {
                yield (0, twilio_1.sendMessage)(formattedUserId, process.env.TWILIO_PHONE_NUMBER, undefined, mediaUrl);
                yield new Promise(resolve => setTimeout(resolve, 10000));
                yield (0, twilio_1.sendMessage)(formattedUserId, process.env.TWILIO_PHONE_NUMBER, (0, mesaages_1.getReplyMessage)('postGen'), undefined);
                yield (0, twilio_1.sendMessage)(formattedUserId, process.env.TWILIO_PHONE_NUMBER, (0, mesaages_1.getReplyMessage)('postGen1'), undefined);
                user.newUser = false;
                user.save();
            }
            else {
                yield (0, twilio_1.sendMessage)(formattedUserId, process.env.TWILIO_PHONE_NUMBER, undefined, mediaUrl);
                yield new Promise(resolve => setTimeout(resolve, 10000));
                yield (0, twilio_1.sendMessage)(formattedUserId, process.env.TWILIO_PHONE_NUMBER, (0, mesaages_1.getReplyMessage)('postGenDefault'), undefined);
            }
        }
    });
}
exports.default = ImageHandler;
