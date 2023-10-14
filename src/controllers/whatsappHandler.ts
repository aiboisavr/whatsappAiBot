import { sendMessage } from "./twilio"
import {incrementStage,decrementStage,getStage,setStage} from "../utils/state"
import User from '../models/user.model' 
import { getReplyMessage } from "../utils/mesaages";
import userChecker from "../utils/userChecker";
import makeApiRequest from '../utils/requestImageGeneration'

export default async function whatsappHandler(incoming: { To: string; From: string; Body:string,MediaUrl0:string})
{
 
    let response:string;
    if(incoming.Body==='Generate')
    {
      response="Please upload an image less than 5mb to create a stunning product photography" 
      await setStage(incoming.From)
      await incrementStage(incoming.From);
      console.log(`generate ${await getStage(incoming.From)}`)
    }
    else if(incoming.Body==='Reupload')
    {  
      if(await getStage(incoming.From)==2)
      {
        response="Please reupload your desired image"
        if(await getStage(incoming.From)!=1)
           await decrementStage(incoming.From);
      }
      else{
        response=getReplyMessage("inappropriateInput",0) ;
      }
        

        //upload image url to db here
     
    }
    else if(incoming.MediaUrl0)
    {  
      if(await getStage(incoming.From)===1)
      {
            response=getReplyMessage("requestPrompt",0) 
            await incrementStage(incoming.From);
            console.log(`Image ${await getStage(incoming.From)}`)
            //upload image url to db here
            const user = await User.findOne({ phoneNumber: incoming.From });
            if (user) {
              user.last_modified=incoming.MediaUrl0;
              user.save()
            }
            
      }
      else{
            response=getReplyMessage("inappropriateInput",0) ;
      }
     
    }
    else if(incoming.Body==='Exit')
    {
      response = await userChecker(incoming);
      await setStage(incoming.From)
      console.log(await getStage(incoming.From));
    }

    else if(await getStage(incoming.From)==2)
    {  
      const user = await User.findOne({ phoneNumber: incoming.From });
      if (user && user.credits !== undefined) {
       user.credits -= 1;
       user.save()
     }
       response="Hold on, We are generating your image"
      const [product,prompt]=incoming.Body.split(',')
      //sendMessage(incoming.From,incoming.To,responseIntermediate)
      await incrementStage(incoming.From);
      
      if(user && user.last_modified)
      makeApiRequest(incoming.Body,user.last_modified,incoming.From);

      /*await new Promise(resolve => setTimeout(resolve, 2000))
      const mediaUrl=['https://raw.githubusercontent.com/dianephan/flask_upload_photos/main/UPLOADS/DRAW_THE_OWL_MEME.png']
      sendMessage(incoming.From,incoming.To,undefined,mediaUrl)


      await new Promise(resolve => setTimeout(resolve, 2000))*/
      
       
    }

    else if(await getStage(incoming.From)==3)
    {
      console.log(await getStage(incoming.From))
      if(incoming.Body==='SameImage')
      {
        response=getReplyMessage("requestPrompt",0) 
        await setStage(incoming.From)
        await incrementStage(incoming.From);
        await incrementStage(incoming.From);

      }
      else{
        response = await userChecker(incoming);
        await setStage(incoming.From)
      }
       
    }
    
    else{
       
      response = await userChecker(incoming);
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