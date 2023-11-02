import { sendMessage } from "./twilio"
import { getReplyMessage } from "../utils/mesaages"
import User from '../models/user.model' 



interface Result
{
   message:string,
   image_url:string[]
}

export default async function ImageHandler(userId:string,Body:Result) {
    
   console.log(userId)
   console.log(Body)
   const formattedUserId = `whatsapp:+${userId.split(":")[1].trim()}`;
   const mediaUrl=Body.image_url

   const user = await User.findOne({ phoneNumber: formattedUserId });
  if(process.env.TWILIO_PHONE_NUMBER)
  {
        if(user?.newUser)
        {
       
         await sendMessage(formattedUserId,process.env.TWILIO_PHONE_NUMBER as string,undefined,mediaUrl)
         await new Promise(resolve => setTimeout(resolve, 10000))
         await sendMessage(formattedUserId,process.env.TWILIO_PHONE_NUMBER as string,getReplyMessage('postGen'),undefined)
         await sendMessage(formattedUserId,process.env.TWILIO_PHONE_NUMBER as string,getReplyMessage('postGen1', user?.credits),undefined)
          user.newUser=false;
          user.save()
        }
        else{
              
         await sendMessage(formattedUserId,process.env.TWILIO_PHONE_NUMBER as string,undefined,mediaUrl)
         await new Promise(resolve => setTimeout(resolve, 10000))
         await sendMessage(formattedUserId,process.env.TWILIO_PHONE_NUMBER as string,getReplyMessage('postGenDefault'),undefined)


        }

  }
  




  

}