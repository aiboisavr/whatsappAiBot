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
const axios_1 = __importDefault(require("axios"));
const sharp_1 = __importDefault(require("sharp"));
const openai_1 = __importDefault(require("openai"));
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY
});
function makeApiRequest(prompt, image, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`${process.env.Base_URL}/api/image?userId=${userId}`);
        console.log(image);
        console.log(userId);
        const elaboratePrompt = yield getElaboratePrompt(prompt);
        const apiUrl = process.env.API_URL;
        const apiKey = process.env.API_KEY;
        const dimensions = yield getImageDimensions(image);
        const requestData = {
            prompt: `${elaboratePrompt ? elaboratePrompt : prompt}`,
            webhook_url: `${process.env.Base_URL}/api/image/?userId=${userId}`,
            image: `https://res.cloudinary.com/dmkarf8ed/image/fetch/w_${dimensions === null || dimensions === void 0 ? void 0 : dimensions.width},h_${dimensions === null || dimensions === void 0 ? void 0 : dimensions.height}/f_png/${image}`
        };
        try {
            const response = yield axios_1.default.post(apiUrl, requestData, {
                headers: {
                    'x-api-key': apiKey,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Request successful:', response.data);
        }
        catch (error) {
            console.error('Request failed:', error);
        }
    });
}
exports.default = makeApiRequest;
function getImageDimensions(mediaUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Download the image
            const response = yield axios_1.default.get(mediaUrl, { responseType: 'arraybuffer' });
            if (response.config.url) {
                // Read the image dimensions using sharp
                let { width, height } = yield (0, sharp_1.default)(response.data).metadata();
                if (width && height && (height >= 1024 || width >= 1024)) {
                    height = height / 2;
                    width = width / 2;
                }
                if (width)
                    width = (Math.floor(width / 8)) * 8;
                if (height) {
                    height = (Math.floor(height / 8)) * 8;
                }
                console.log(`Height:${height}, width:${width}`);
                // Delete the temporary file
                // await unlink(response.config.url);
                return { width, height };
            }
            else {
                console.error('URL is undefined. Cannot delete the temporary file.');
            }
        }
        catch (error) {
            console.error('Error fetching image or reading dimensions:', error);
            return null;
        }
    });
}
function getElaboratePrompt(prompt) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const elaboratePrompt = yield openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { "role": "user", "content": `We are a prompt generation company aimed at creating elaborated prompts and background,We wil give the product and background in this format 'product, background '.You will have to return an eloborate prompt that will be compatible with stable diffusion image generation/inpainting when I provide the specified format.Do not add any details on the product rather focus on the background.Begin the sentence with respect to the product from the format given for example if it is chair,in a room begin it as Chair placed in a or Chair in a like that kind of usage.Give the prompt in a bit of concise manner but used nice common words.Be to the point separating the adjectives by comma rather than creating long sentence 
          Here Is the required combination
          ${prompt}` },
                ],
            });
            console.log(`elaborate prompt`);
            console.log((_b = (_a = elaboratePrompt === null || elaboratePrompt === void 0 ? void 0 : elaboratePrompt.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content);
            return (_d = (_c = elaboratePrompt === null || elaboratePrompt === void 0 ? void 0 : elaboratePrompt.choices[0]) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.content;
        }
        catch (e) {
            console.log(`Error while trying to elaborate given prompt: ${e}`);
        }
    });
}
//"https://ik.imagekit.io/lkrvcrvnx/img_OcMnKBpwU.png?updatedAt=1696658007323?tr=orig-true"//`${finalImage.request.socket._httpMessage.res.responseUrl}`,
//'https://eol2i63njsm32p7.m.pipedream.net?userId=123',//
//const finalImage= await axios.get(image)
//console.log(finalImage.request.socket._httpMessage.res.responseUrl)
