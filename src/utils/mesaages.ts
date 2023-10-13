const messages: Record<string, string>  = {
    "welComeMessage":"Hello, \n We're thrilled to have you join our platform! 🎉You currently have 2 credits in your account. These credits can be used for various activities on the platform. Enjoy your time on our platform, and make the most of your credits!",
    "generateMessage":"Please Press Generate to proceed",
    "inappropriateInput":"Please follow the flow to Generate images ",
    "requestPrompt":"Please provide the name of the image provided and a brief description or information about the background of image you've uploaded in the format Produtname,Background \n eg: Chair,In a room.\n or if you want to reupload the image type Reupload",
    "insufficientCredits":"Dear user, \n We regret to inform you that you currently have no credits left in your account. If you wish to continue using our services, you can purchase additional credits using the button below.Thank you for using our platform, and we hope you have a great day.",
    "afterGeneration":"Hope you liked the generated Image, inorder to generate more with same image and prompt press SameImage button below. To start with a new Image, press Generate or press Exit to exit the flow ."
}

export function getReplyMessage(messageOption: string, credits:Number): string{
    if(credits){
        switch(messageOption){
           case 'creditBalance':
                return `Hello, \n Welcome back! 🎉You currently have ${credits} credits in your account. These credits can be used for various activities on the platform. Enjoy your time on our platform, and make the most of your credits!`

        }

       return messageOption;
    }
    return messages[messageOption];
}


