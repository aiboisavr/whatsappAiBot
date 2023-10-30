"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setStage = exports.getStage = exports.decrementStage = exports.incrementStage = void 0;
let stage = {};
function incrementStage(userPhoneNumber) {
    stage[userPhoneNumber] = stage[userPhoneNumber] ? stage[userPhoneNumber] + 1 : 1;
}
exports.incrementStage = incrementStage;
function decrementStage(userPhoneNumber) {
    stage[userPhoneNumber] = stage[userPhoneNumber] ? stage[userPhoneNumber] - 1 : 0;
}
exports.decrementStage = decrementStage;
function getStage(userPhoneNumber) {
    return stage[userPhoneNumber];
}
exports.getStage = getStage;
function setStage(userPhoneNumber) {
    stage[userPhoneNumber] = 0;
}
exports.setStage = setStage;
