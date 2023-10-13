
import {incrementStage,decrementStage,getStage,setStage} from "../utils/state"
import User from '../models/user.model' 
import { getReplyMessage } from "../utils/mesaages";

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
        return `${getReplyMessage('insufficientCredits',0)}.`
      }
      else
      {
        return `${getReplyMessage('creditBalance',isExistingUser.credits)}.\n Please type the command Generate to proceed`
        
      }
    }
    setStage()
    console.log(getStage());


}



