import { sendMessage } from "./twilio"

export default function whatsappHandler(incoming: { To: string; From: string })
{
      sendMessage(incoming.From,incoming.To,"Test")
}