import { sendMessage } from "./twilio"
import {incrementStage,decrementStage,getStage,setStage} from "../utils/state"
import User from '../models/user.model' 
import { getReplyMessage } from "../utils/mesaages";
import userChecker from "../utils/userChecker";
import makeApiRequest from '../utils/requestImageGeneration'

export default async function whatsappHandler(incoming: { To: string; From: string; Body:string,MediaUrl0:string})
{
    const user = await User.findOne({ phoneNumber: incoming.From });
    let response:string|undefined;
    let responseWaiting:string='';

    if(incoming.Body==='Create')
    {
      if(user?.newUser)
      {
        await sendMessage(incoming.From,incoming.To,getReplyMessage('howToCreate'))

        await sendMessage(incoming.From,incoming.To,getReplyMessage('imageUploadNew'))
  
      }

      else{
      
          await sendMessage(incoming.From,incoming.To,getReplyMessage('imageUpload'))
         
         // add default flow
      }
      await setStage(incoming.From)
      await incrementStage(incoming.From);

      console.log(`generate ${await getStage(incoming.From)}`)
      
    }



    
    else if(incoming.Body==='Upload New')
    {  
      if(await getStage(incoming.From)==2)
      {
        await sendMessage(incoming.From,incoming.To,getReplyMessage('imageUpload'))
        if(await getStage(incoming.From)!=1)
           await decrementStage(incoming.From);
      }
      else{
        response=getReplyMessage("inappropriateInput") ;
      }  
     
    }




    else if(incoming.MediaUrl0)
    {  


      if(await getStage(incoming.From)===1)
      {

        if(user?.newUser)
        {
          await sendMessage(incoming.From,incoming.To,getReplyMessage('requestPromptNew'))
          
        }
        else{
          await sendMessage(incoming.From,incoming.To,getReplyMessage('requestPrompt'))
        }
        await incrementStage(incoming.From);
        console.log(`Image ${await getStage(incoming.From)}`)
        //upload image url to db here
        
        if (user) {
          user.last_modified=incoming.MediaUrl0;
          user.save()
        }
        
      }

      else{
            
            await sendMessage(incoming.From,incoming.To,getReplyMessage('inappropriateInput'))
      }
     
    }




    else if(incoming.Body==='Back to Home')
    {
      response = await userChecker(incoming);
      if(response)
       sendMessage(incoming.From,incoming.To,response)

      await setStage(incoming.From)
      console.log(await getStage(incoming.From));
    }





    else if(await getStage(incoming.From)==2)
    {  
      
      const [product,prompt]=incoming.Body.split(',')
      await incrementStage(incoming.From);
      
      if(user && user.last_modified)
      makeApiRequest(incoming.Body,user.last_modified,incoming.From);


      await sendMessage(incoming.From,incoming.To,getReplyMessage('confirmation'))
      await new Promise(resolve => setTimeout(resolve, 10000))
      await sendMessage(incoming.From,incoming.To,getReplyMessage('waiting'))

      if (user && user.credits !== undefined) {
        user.credits -= 1;
        user.save()
      }

       
    }

    else if(await getStage(incoming.From)==3)
    {
     
       

      if(incoming.Body==='Generate Again')
      {
        await sendMessage(incoming.From,incoming.To,getReplyMessage('requestPrompt'))
        await setStage(incoming.From)
        await incrementStage(incoming.From);
        await incrementStage(incoming.From);

      }
      else{
        response = await userChecker(incoming);
        if(response)
        sendMessage(incoming.From,incoming.To,response)

        await setStage(incoming.From)
      }
       
    }

    else if(incoming.Body==='Get Credits')
    {
      sendMessage(incoming.From,incoming.To,getReplyMessage('getCredits',user?.credits))
    }
    
    else{
       
      response = await userChecker(incoming);
      if(response)
      sendMessage(incoming.From,incoming.To,response)

    }


}




  