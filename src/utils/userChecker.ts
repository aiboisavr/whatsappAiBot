
import {incrementStage,decrementStage,getStage,setStage} from "../utils/state"
import User from '../models/user.model' 
import { getReplyMessage } from "../utils/mesaages";
import { generatePaymentLink } from "../controllers/paymentHandler";


export default async function userChecker(incoming: { To?: string; From: any; Body?: string; MediaUrl0?: string; })
{


    const isExistingUser = await User.findOne({ phoneNumber: incoming.From })
     

    if(!isExistingUser){
      const user = await User.create({
        phoneNumber: incoming.From
      })
    
      console.log(`New user created with phone Number: ${user.phoneNumber} with ${user.credits} credits remaining.`)
       return `${getReplyMessage('welComeMessage',0)}.\n Please type the command Generate to proceed`
     
    
    }else{
      if(isExistingUser.credits==0){
        let paymentLink
        const paymentLinkParams = {
          phoneNumber: isExistingUser.phoneNumber.split(':')[1], 
          amount: 100, 
          referenceId: `${isExistingUser.phoneNumber}_${new Date().getTime()}`
        }
        try{
          paymentLink = await generatePaymentLink(paymentLinkParams)
        }catch(e){
          console.log(`PaymentLink error${e}`)
        }
        return `${getReplyMessage('insufficientCredits',0)}. \n ${paymentLink}`
      }
      else
      {
        return `${getReplyMessage('creditBalance',isExistingUser.credits)}.\n Please type the command Generate to proceed`
        
      }
    }
    await setStage(incoming.From)
    console.log(await getStage(incoming.From));


}



