import { sendMessage } from "./twilio"
import {incrementStage,decrementStage,getStage,setStage} from "../utils/state"
import User from '../models/user.model' 
import { getReplyMessage } from "../utils/mesaages";


export default async function whatsappHandler(incoming: { To: string; From: string; Body:string,MediaUrl0:string})
{
     
    console.log("Hi")

    let response:string;
    if(incoming.Body==='Generate')
    {
      response='Hey that is great please upload an image to get started' 
      setStage()
      incrementStage();
      console.log(`generate ${getStage()}`)
    }
    else if(incoming.MediaUrl0)
    {  
      if(getStage()===1)
      {
            response='Please enter the prompt for image'
            incrementStage();
            console.log(`Image ${getStage()}`)
      }
      else{
            response='Please follow the flow to get result';
      }
     
    }
    else if(incoming.Body==='Exit')
    {
      response='Thankyou for using the bot.Try again using command Generate'
      setStage()
      console.log(getStage());
    }

    else if(getStage()===2)
    {
      response='Please eneter the details regarding background'
      incrementStage();
      console.log(`prompt ${getStage()}`)
    }

    else if(getStage()==3)
    {
       response="Hold on, We are generating your image"
       incrementStage();
      console.log(`complete ${getStage()}`)
    }
    
    else{
      const isExistingUser = await User.findOne({ phoneNumber: incoming.From })
      response='Please type the command Generate to proceed'

      if(!isExistingUser){
        const user = await User.create({
          phoneNumber: incoming.From
        })
        console.log(`new user created with phone Number: ${user.phoneNumber} with ${user.credits} credits remaining.`)
        response = await getReplyMessage('welComeMessage')
      }else{
        if(isExistingUser.credits==0){
          response = await getReplyMessage('insufficientCredits')
        }
      }
      setStage()
      console.log(getStage());
    }


    

     sendMessage(incoming.From,incoming.To,response)
}


/* switch(incoming.Body)
     {
         case 'Generate':
            {
                 response='Hey that is great please upload an image to get started' 
                 setStage()
                 incrementStage();
                 console.log(`generate ${getStage()}`)
            }
            break;

          

         default:
            {
                  response='Please type the command Generate to proceed'
                  setStage()
                  console.log(getStage());
            }
     }*/