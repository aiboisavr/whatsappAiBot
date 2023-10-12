import mongoose from "mongoose";

const { Schema } = mongoose;

const paymentSchema = new Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
    },
    referenceId:{
      type:String,
      required:true
    },
    status:{
        type:String,
        enum: ['pending','successful'],
        required: true,
        default: "pending" 
    }
  }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
