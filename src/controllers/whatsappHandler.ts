import { sendMessage } from "./twilio"
import {incrementStage,decrementStage,getStage,setStage} from "../utils/state"

export default function whatsappHandler(incoming: { To: string; From: string; Body:string })
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
    else if(incoming.Body==='Image')
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
      response='Please type the command Generate to proceed'
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