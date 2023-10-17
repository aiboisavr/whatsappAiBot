
import {incrementStage,decrementStage,getStage,setStage} from "../utils/state"
import User from '../models/user.model' 
import { getReplyMessage } from "../utils/mesaages";
import { generatePaymentLink } from "../controllers/paymentHandler";

const paymentPlans = {
  "basic":1000,
  "advanced":10000,
  "pro":5000
}


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
      if(incoming.Body==="basic" || incoming.Body ==="advanced" || incoming.Body === "pro"){
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
      if(isExistingUser.credits==0){
        return `${getReplyMessage('insufficientCredits',0)}. Please choose any of the following plans to proceed \n Basic: 10Rs - 10 images \n Pro: 50Rs - 75 images \n Pro Max Ultimate 100Rs - 150 images`
      }
      else
      {
        return `${getReplyMessage('creditBalance',isExistingUser.credits)}.\n Please type the command Generate to proceed`
        
      }
    }
    await setStage(incoming.From)
    console.log(await getStage(incoming.From));


}



