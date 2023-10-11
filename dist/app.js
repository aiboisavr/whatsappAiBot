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
const db_1 = require("./config/db");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const whatsappHandler_1 = __importDefault(require("./controllers/whatsappHandler"));
(0, db_1.connectToDatabase)();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(body_parser_1.default.json());
app.use(express_1.default.urlencoded({
    extended: true,
}));
app.post('/api/bot', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, whatsappHandler_1.default)(req.body);
        console.log(req.body.From);
        console.log(req.body.To);
    });
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
