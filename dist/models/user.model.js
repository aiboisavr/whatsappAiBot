"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const userSchema = new Schema({
    phoneNumber: {
        type: String,
        required: true,
    },
    credits: {
        type: Number,
        required: true,
        default: 10
    },
    last_modified: {
        type: String,
    },
    newUser: {
        type: Boolean,
        default: true
    }
});
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
