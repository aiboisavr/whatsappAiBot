
import {incrementStage,decrementStage,getStage,setStage} from "../utils/state"
import User from '../models/user.model' 
import { getReplyMessage } from "../utils/mesaages";
import { generatePaymentLink } from "../controllers/paymentHandler";
import { sendMessage } from "../controllers/twilio";

interface Plan {
  amount: number;
  credits: number;
}

export const paymentPlans:{ [key: string]: Plan } = {
  "Starter":{
    amount:10,
    credits:10
  },
  "Basic":{
    amount:50,
    credits:75
  },
  "Pro":{
    amount:100,
    credits:150
  }
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
        const phoneNumber = isExistingUser.phoneNumber.split(':')[1]
        const paymentLinkParams = {
          phoneNumber: phoneNumber, 
          amount: paymentPlans[incoming.Body].amount*100, 
          referenceId: `${phoneNumber}_${new Date().getTime()}_${incoming.Body}`
        }

        try{
          paymentLink = await generatePaymentLink(paymentLinkParams)
          return `Great choice! The ${incoming.Body} pack looks perfect for you.\n\nPlease use the link below to complete payment within the next 10 minutes.\n${paymentLink}`
        }catch(e){
          console.log(`PaymentLink error${e}`)
        }
      }
      else if(incoming.Body==='Back to Home'){
        return `${getReplyMessage('creditBalance',isExistingUser.credits)}`
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



