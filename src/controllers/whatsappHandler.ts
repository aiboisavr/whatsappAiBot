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
      response="Please upload an image less than 5mb to create a stunning product photography" 
      setStage()
      incrementStage();
      console.log(`generate ${getStage()}`)
    }
    else if(incoming.MediaUrl0)
    {  
      if(getStage()===1)
      {
            response=getReplyMessage("requestPrompt",0) 
            incrementStage();
            console.log(`Image ${getStage()}`)
      }
      else{
            response=getReplyMessage("inappropriateInput",0) ;
      }
     
    }
    else if(incoming.Body==='Exit')
    {
      response='Thankyou for using the bot.Try again using command Generate'
      setStage()
      console.log(getStage());
    }

    /*else if(getStage()===2)
    {
      response='Please eneter the details regarding background'
      incrementStage();
      console.log(`prompt ${getStage()}`)
    }*/

    else if(getStage()==2)
    {
      const responseIntermediate="Hold on, We are generating your image"
      const [product,prompt]=incoming.Body.split(',')
      console.log(prompt)
      console.log(product)
      sendMessage(incoming.From,incoming.To,responseIntermediate)

      incrementStage();

      await new Promise(resolve => setTimeout(resolve, 2000))
      const mediaUrl=['https://raw.githubusercontent.com/dianephan/flask_upload_photos/main/UPLOADS/DRAW_THE_OWL_MEME.png']
      sendMessage(incoming.From,incoming.To,undefined,mediaUrl)


      await new Promise(resolve => setTimeout(resolve, 2000))
      response=getReplyMessage("afterGeneration",0)

      const user = await User.findOne({ phoneNumber: incoming.From });
       if (user && user.credits !== undefined) {
        user.credits -= 1;
        user.save()
      }
       
    }
    
    else{
      const isExistingUser = await User.findOne({ phoneNumber: incoming.From })
     

      if(!isExistingUser){
        const user = await User.create({
          phoneNumber: incoming.From
        })

        console.log(`New user created with phone Number: ${user.phoneNumber} with ${user.credits} credits remaining.`)
         response =`${getReplyMessage('welComeMessage',0)}.\n Please type the command Generate to proceed`
       

      }else{
        if(isExistingUser.credits==0){
          response = `${getReplyMessage('insufficientCredits',0)}.`
        }
        else
        {
          response = `${getReplyMessage('creditBalance',isExistingUser.credits)}.\n Please type the command Generate to proceed`
          
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