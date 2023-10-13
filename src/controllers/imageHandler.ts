import { sendMessage } from "./twilio"
import { getReplyMessage } from "../utils/mesaages"

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
  if(process.env.TWILIO_PHONE_NUMBER)
  sendMessage(formattedUserId,process.env.TWILIO_PHONE_NUMBER as string,undefined,mediaUrl)


await new Promise(resolve => setTimeout(resolve, 3000))
 const response=getReplyMessage("afterGeneration",0)
  if(process.env.TWILIO_PHONE_NUMBER)
  sendMessage(formattedUserId,process.env.TWILIO_PHONE_NUMBER as string,response,undefined)

}