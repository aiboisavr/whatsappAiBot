import Razorpay from 'razorpay'
import User from '../models/user.model'
import { sendMessage } from "./twilio"


var instance = new Razorpay({ 
    key_id: process.env.RAZORPAY_KEY_ID as string, 
    key_secret: process.env.RAZORPAY_SECRET as string
})

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
        return paymentLink?.short_url
    }catch(e){
        console.log(`Error while trying to create paymentLink::${JSON.stringify(e)}`)
    }
}

export async function handleOrderPaid(orderResponse:{receipt:string}){
    const userPhoneNumber = orderResponse.receipt.split('_')[0];
    const user = await User.findOneAndUpdate(
        {phoneNumber: userPhoneNumber},
        {credits:5}
    )
    if(userPhoneNumber=='whatsapp:+918606721804'){
        console.log('number matching')
    }
    console.log(`User After update:::${JSON.stringify(user)}`)
    sendMessage('whatsapp:+918606721804','whatsapp:+14155238886','Order Successful.')
}
