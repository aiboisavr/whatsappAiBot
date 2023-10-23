import { paymentPlans } from "./userChecker";

const messages: Record<string, string>  = {
 


    "Dehidden":"👋Hello, welcome to Dehidden AI",

    "welcomeMessageNew":"You can create stunning product photos here, helping you get\n✅50x faster results\n✅20x better looking products\n✅8x higher conversions",

    "createHelp":"Let's create your first product photo. Click on 'Create' below to get started.",

    "howToCreate":"You can create your product image in 2 simple steps\n1️⃣Send the product image\n2️⃣Describe your desired photo\nThat's it, let's get started! 🚀",

    "imageUploadNew":"Please send your product image, make sure it is positioned well and clear 📲(Please ensure the image size is less than 5mb).",

    "requestPromptNew":"Great! Now tell me your product name and a short description of the scene you want. Make sure to separate them with a comma.\n\nHere are a few examples:\n1. Sofa, in a cozy living room\n2. Table, in a modern bedroom\n3. Chair, on a sunny balcony\n\nIf you wish to change the product image, choose 'Upload New' below.",

    "confirmation":"Please wait, we are generating your image ⌛",

    "waiting":"Adding the final magic, and sending you the photo right away... ⬇️",

    "postGen":"That was fun. Hope you liked the photo!",

    "postGen1":"You have credits left to create 9 more photos for free. And then load up more from the 'Get Credits' option below.\nSo let's start creating! 📸",


    

    "imageUpload":"Please send your product image, make sure it is positioned well and clear 📲(Please ensure the image size is less than 5mb).",

    "requestPrompt":"Great! Now tell me your product name and a short description of the scene you want. Make sure to separate them with a comma.\nFor example: Sofa, in a cozy living room\nIf you wish to change the product image, choose 'Upload New' below.",

    "postGenDefault":"Now get more photos of the same product using 'Generate Again' 🔄\nOr create photo for a new product using 'Create' 🆕",

    "insufficientCredits":"Oh no! It appears you're out of photo credits 😔\n\nWorry not, you can create more photos by purchasing one of our credit packs  🙌",
    
    "inappropriateInput":"I don't quite understand your request 🤔\n\nIn case you have any doubts, learn how to use Dehidden AI from 'FAQ' below.\nElse, let's get back to creating your stunning product photos! 🚀",
    
    "promptError":"It seems like your product name or description has some errors 🚫\nHere are some example correct inputs:\n1. Sofa, in a cozy living room\n2. Table, in a modern bedroom\n3. Chair, on a sunny balcony\n\nMake sure to separate them with a comma.\n\nPlease try sharing the name and description for your product again 🔄",
   
    "paymentError":"Oh no! Looks like you ran out of time or the payment was not a success. 😔\nReselect your required Credit Pack below and let's try the payment again.",

    "FAQ":`Learn about Dehidden AI with this FAQ:\nQ. What is Dehidden AI?\n➡️ Dehidden AI creates stunning professional product photos for your product.\n\nQ. How to create photos?\n➡️ 2 simple steps: Click 'Create'. Send your product image and describe your desired photo.\n\nQ. How do credits work?\n➡️ Each photo costs 1 credit. Buy more credits using 'Get Credits'.\n\nQ. How to get more credits?\n➡️ Visit the main menu and use 'Get Credits, to choose from these plans:\n\n- Starter: 10 Photos for 50 INR\n- Basic: 75 Photos for 300 INR\n- Pro: 150 Photos for 500 INR`

    
}

export function getReplyMessage(messageOption: string, credits?:Number): string{
    if(credits!= null || credits != undefined){
        switch(messageOption){
           case 'creditBalance':
                return `👋 Hey there, welcome to Dehidden AI — create amazing professional photographs for your product instantly!\n\nYou currently have ${credits} photo credits remaining\n\nSimply click on 'Create' to get started! 🚀`
            
            case 'getCredits':
                return `You have currently ${credits} photo credits remaining.\n\nPurchase more credits by choosing any one of our below packs:\nStarter — ${paymentPlans[`Starter`].credits} Photos for ${paymentPlans[`Starter`].amount} INR\nBasic — ${paymentPlans[`Basic`].credits} Photos for ${paymentPlans[`Basic`].amount} INR \nPro — ${paymentPlans[`Pro`].credits} Photos for ${paymentPlans[`Pro`].amount} INR` 
            

        }
    }
    return messages[messageOption];
}


