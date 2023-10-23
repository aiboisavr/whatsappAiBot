import Razorpay from 'razorpay'
import User from '../models/user.model'
import { sendMessage } from "./twilio"
import { paymentPlans } from '../utils/userChecker'
import { getReplyMessage } from '../utils/mesaages'


var instance = new Razorpay({ 
    key_id: process.env.RAZORPAY_KEY_ID as string, 
    key_secret: process.env.RAZORPAY_SECRET as string
})
//console.log(instance)

export async function generatePaymentLink(paymentDetails:{ phoneNumber:string, amount: number, referenceId:string}){
    try{
        const paymentLink = await instance.paymentLink.create({
            reference_id: paymentDetails.referenceId,
            amount: paymentDetails.amount,
            currency: "INR",
            description: "Subscription",
            customer: {
              name: `${paymentDetails.phoneNumber}_user`,
              email: "",
              contact: paymentDetails.phoneNumber
            }
        })
        console.log(paymentLink)
        return paymentLink?.short_url
    }catch(e){
        console.log(`Error while trying to create paymentLink::${JSON.stringify(e)}`)
    }
}

export async function handleOrderPaid(orderResponse:{receipt:string}){
    const userPhoneNumber = `whatsapp:${orderResponse.receipt.split('_')[0]}`;
    const userPlan = orderResponse.receipt.split('_')[2]
    const creditsPurchased = paymentPlans[userPlan].credits
    const user = await User.findOneAndUpdate(
        {phoneNumber: userPhoneNumber},
        { $inc: { credits: creditsPurchased } },
        { new: true }
    )
    sendMessage(userPhoneNumber,process.env.TWILIO_PHONE_NUMBER as string,`Congrats, your payment is successful! The ${userPlan} pack is now activated! ✅\nYou have now ${user?.credits} Photo Credits remaining\n\nStart creating new photos of your product now! 📸`)
}

export async function handlePaymentFailed(paymentFailedResponse:{ reference_id:string }){
    const referenceId = paymentFailedResponse.reference_id
    const userPhoneNumber = `whatsapp:${referenceId.split('_')[0]}`;
    sendMessage(userPhoneNumber,process.env.TWILIO_PHONE_NUMBER as string,getReplyMessage('paymentError'))
}
