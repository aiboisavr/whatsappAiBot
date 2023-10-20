
import {incrementStage,decrementStage,getStage,setStage} from "../utils/state"
import User from '../models/user.model' 
import { getReplyMessage } from "../utils/mesaages";
import { generatePaymentLink } from "../controllers/paymentHandler";
import { sendMessage } from "../controllers/twilio";

const paymentPlans = {
  "Starter":5000,
  "Basic":30000,
  "Pro":50000
}


export default async function userChecker(incoming: { To: string; From: any; Body?: string; MediaUrl0?: string; })
{


    const isExistingUser = await User.findOne({ phoneNumber: incoming.From })
     

    if(!isExistingUser){
      const user = await User.create({
        phoneNumber: incoming.From
      })
    
      console.log(`New user created with phone Number: ${user.phoneNumber} with ${user.credits} credits remaining.`)
     
    
       await sendMessage(incoming.From,incoming.To,getReplyMessage('Dehidden'))
       await new Promise(resolve => setTimeout(resolve, 1000))
       await sendMessage(incoming.From,incoming.To,getReplyMessage('welcomeMessageNew'))
       await new Promise(resolve => setTimeout(resolve, 1000))
       await sendMessage(incoming.From,incoming.To,getReplyMessage('createHelp'))
       
      // return `${getReplyMessage('welComeMessage',0)}.\n Please type the command Generate to proceed`

   return "";
    
    }else{
      
      if(isExistingUser.newUser)
      {
        await sendMessage(incoming.From,incoming.To,getReplyMessage('Dehidden'))
         await new Promise(resolve => setTimeout(resolve, 1000))
         await sendMessage(incoming.From,incoming.To,getReplyMessage('welcomeMessageNew'))
         await new Promise(resolve => setTimeout(resolve, 1000))
        await sendMessage(incoming.From,incoming.To,getReplyMessage('createHelp'))
      }

      else if(incoming.Body==="Starter" || incoming.Body ==="Basic" || incoming.Body === "Pro"){
        let paymentLink
        const paymentLinkParams = {
          phoneNumber: isExistingUser.phoneNumber.split(':')[1], 
          amount: paymentPlans[incoming.Body], 
          referenceId: `${isExistingUser.phoneNumber}_${new Date().getTime()}`
        }

        try{
          paymentLink = await generatePaymentLink(paymentLinkParams)
          return `Please use this link to complete payment and enjoy the benefits of the ${incoming.Body} plan. \n ${paymentLink}`
        }catch(e){
          console.log(`PaymentLink error${e}`)
        }
      }
      else if(isExistingUser.credits==0){
        return `${getReplyMessage('insufficientCredits')}`
      }
      else
      {
        return `${getReplyMessage('creditBalance',isExistingUser.credits)}`
        
      }
    }
    await setStage(incoming.From)
    console.log(await getStage(incoming.From));


}



