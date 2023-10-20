const messages: Record<string, string>  = {
 


    "Dehidden":"👋Hello, welcome to Dehidden AI",

    "welcomeMessageNew":"You can create stunning product photos here, helping you get\n✅50x faster results\n✅20x better looking products\n✅8x higher conversions",

    "createHelp":"Let's create your first product photo. Click on 'Create' below to get started.",

    "howToCreate":"You can create your product image in 2 simple steps\nSend the product image\nDescribe your desired photo\nThat's it, let's get started! 🚀",

    "imageUploadNew":"Please send your product image, make sure it is positioned well and clear 📲",

    "requestPromptNew":"Great! Now tell me your product name and a short description of the scene you want. Make sure to separate them with a comma.\nHere are a few examples:\n1. Sofa, in a cozy living room\n2. Table, in a modern bedroom\n3. Chair, on a sunny balcony\nIf you wish to change the product image, choose 'Upload New' below.",

    "confirmation":"Please wait, we are generating your image ⌛",

    "waiting":"Adding the final magic, and sending you the photo right away... ⬇️",

    "postGen":"That was fun. Hope you liked the photo! ",

    "postGen1":"You have credits left to create 9 more photos for free. And then load up more from the 'Get Credits' option below.\nSo let,s start creating! 📸\nButton — Create\nButton — Get Credits\nButton — Back to Home",


    

    "imageUpload":"Please send your product image",

    "requestPrompt":"Great! Now tell me your product name and a short description of the scene you want. Make sure to separate them with a comma.\nFor example: Sofa, in a cozy living room\nIf you wish to change the product image, choose 'Upload New' below.\nButton — Upload New\nButton — Back to Home",

    "postGenDefault":"Now get more photos of the same product using 'Generate Again' 🔄\nOr create photo for a new product using 'Create' 🆕\nButton — Generate Again\nButton — Create\nButton — Back to Home",

    "insufficientCredits":"Oh no! It appears you're out of photo credits 😔\n\nWorry not, you can create more photos by purchasing one of our credit packs  🙌\nButton — Get Credits\nButton — Back to Home",
    
    "inappropriateInput":"I don't quite understand your request 🤔\n\nIn case you have any doubts, learn how to use Dehidden AI from 'FAQ' below.\nElse, let's get back to creating your stunning product photos! 🚀\nButton — Create\nButton — FAQ\nButton — Back to Home ",
    
   


    
}

export function getReplyMessage(messageOption: string, credits?:Number): string{
    if(credits){
        switch(messageOption){
           case 'creditBalance':
                return `👋 Hey there, welcome to Dehidden AI — create amazing professional photographs for your product instantly!\nYou currently have ${credits} photo credits remaining\nSimply click on Create to get started! 🚀\nButton — Create\nButton — Get Credits\nButton — FAQ`
            
            case 'getCredits':
                return `You have currently ${credits} photo credits remaining.\n\nPurchase more credits by choosing any one of our below packs:\nStarter — 10 Photos for 50 INR\nBasic — 75 Photos for 300 INR \nPro — 150 Photos for 500 INR` 
            

        }

       return messageOption;
    }
    return messages[messageOption];
}


