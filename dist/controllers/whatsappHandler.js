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
const state_1 = require("../utils/state");
const user_model_1 = __importDefault(require("../models/user.model"));
const mesaages_1 = require("../utils/mesaages");
const userChecker_1 = __importDefault(require("../utils/userChecker"));
const requestImageGeneration_1 = __importDefault(require("../utils/requestImageGeneration"));
function whatsappHandler(incoming) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_model_1.default.findOne({ phoneNumber: incoming.From });
        let response;
        let responseWaiting = '';
        if (incoming.Body === 'Create') {
            yield (0, state_1.setStage)(incoming.From);
            if (user === null || user === void 0 ? void 0 : user.newUser) {
                yield (0, twilio_1.sendMessage)(incoming.From, incoming.To, (0, mesaages_1.getReplyMessage)('howToCreate'));
                yield (0, twilio_1.sendMessage)(incoming.From, incoming.To, (0, mesaages_1.getReplyMessage)('imageUploadNew'));
            }
            else {
                if ((user === null || user === void 0 ? void 0 : user.credits) && user.credits > 0) {
                    yield (0, twilio_1.sendMessage)(incoming.From, incoming.To, (0, mesaages_1.getReplyMessage)('imageUpload'));
                }
                else {
                    return yield (0, twilio_1.sendMessage)(incoming.From, incoming.To, (0, mesaages_1.getReplyMessage)('insufficientCredits'));
                }
            }
            yield (0, state_1.incrementStage)(incoming.From);
            console.log(`generate ${yield (0, state_1.getStage)(incoming.From)}`);
        }
        else if (incoming.Body === 'Upload New') {
            if ((yield (0, state_1.getStage)(incoming.From)) == 2) {
                yield (0, twilio_1.sendMessage)(incoming.From, incoming.To, (0, mesaages_1.getReplyMessage)('imageUpload'));
                if ((yield (0, state_1.getStage)(incoming.From)) != 1)
                    yield (0, state_1.decrementStage)(incoming.From);
            }
            else {
                yield (0, twilio_1.sendMessage)(incoming.From, incoming.To, (0, mesaages_1.getReplyMessage)("inappropriateInput"));
                yield (0, state_1.setStage)(incoming.From);
            }
        }
        else if (incoming.MediaUrl0) {
            if ((yield (0, state_1.getStage)(incoming.From)) === 1) {
                if (user === null || user === void 0 ? void 0 : user.newUser) {
                    yield (0, twilio_1.sendMessage)(incoming.From, incoming.To, (0, mesaages_1.getReplyMessage)('requestPromptNew'));
                }
                else {
                    yield (0, twilio_1.sendMessage)(incoming.From, incoming.To, (0, mesaages_1.getReplyMessage)('requestPrompt'));
                }
                yield (0, state_1.incrementStage)(incoming.From);
                console.log(`Image ${yield (0, state_1.getStage)(incoming.From)}`);
                //upload image url to db here
                if (user) {
                    user.last_modified = incoming.MediaUrl0;
                    user.save();
                }
            }
            else {
                yield (0, twilio_1.sendMessage)(incoming.From, incoming.To, (0, mesaages_1.getReplyMessage)('inappropriateInput'));
                yield (0, state_1.setStage)(incoming.From);
            }
        }
        else if (incoming.Body === 'Back to Home') {
            response = yield (0, userChecker_1.default)(incoming);
            if (response)
                (0, twilio_1.sendMessage)(incoming.From, incoming.To, response);
            yield (0, state_1.setStage)(incoming.From);
            console.log(yield (0, state_1.getStage)(incoming.From));
        }
        else if ((yield (0, state_1.getStage)(incoming.From)) == 2) {
            const [product, prompt] = incoming.Body.split(',');
            console.log(product);
            console.log(prompt);
            if (product && prompt && product != '' && prompt != '') {
                yield (0, state_1.incrementStage)(incoming.From);
                if (user && user.last_modified)
                    (0, requestImageGeneration_1.default)(incoming.Body, user.last_modified, incoming.From);
                yield (0, twilio_1.sendMessage)(incoming.From, incoming.To, (0, mesaages_1.getReplyMessage)('confirmation'));
                yield new Promise(resolve => setTimeout(resolve, 10000));
                yield (0, twilio_1.sendMessage)(incoming.From, incoming.To, (0, mesaages_1.getReplyMessage)('waiting'));
                if (user && user.credits !== undefined) {
                    user.credits -= 1;
                    user.save();
                }
            }
            else {
                yield (0, twilio_1.sendMessage)(incoming.From, incoming.To, (0, mesaages_1.getReplyMessage)('promptError'));
            }
        }
        else if ((yield (0, state_1.getStage)(incoming.From)) == 3) {
            if (incoming.Body === 'Generate Again') {
                if ((user === null || user === void 0 ? void 0 : user.credits) && user.credits > 0) {
                    yield (0, twilio_1.sendMessage)(incoming.From, incoming.To, (0, mesaages_1.getReplyMessage)('requestPrompt'));
                    yield (0, state_1.setStage)(incoming.From);
                    yield (0, state_1.incrementStage)(incoming.From);
                    yield (0, state_1.incrementStage)(incoming.From);
                }
                else {
                    yield (0, state_1.setStage)(incoming.From);
                    yield (0, twilio_1.sendMessage)(incoming.From, incoming.To, (0, mesaages_1.getReplyMessage)('insufficientCredits'));
                }
            }
            else {
                response = yield (0, userChecker_1.default)(incoming);
                if (response)
                    (0, twilio_1.sendMessage)(incoming.From, incoming.To, response);
                yield (0, state_1.setStage)(incoming.From);
            }
        }
        else if (incoming.Body === 'Get Credits' || incoming.Body === 'Change Pack') {
            (0, twilio_1.sendMessage)(incoming.From, incoming.To, (0, mesaages_1.getReplyMessage)('getCredits', user === null || user === void 0 ? void 0 : user.credits));
        }
        else if (incoming.Body === 'FAQ') {
            (0, twilio_1.sendMessage)(incoming.From, incoming.To, (0, mesaages_1.getReplyMessage)('FAQ'));
        }
        else {
            response = yield (0, userChecker_1.default)(incoming);
            if (response)
                (0, twilio_1.sendMessage)(incoming.From, incoming.To, response);
        }
    });
}
exports.default = whatsappHandler;
