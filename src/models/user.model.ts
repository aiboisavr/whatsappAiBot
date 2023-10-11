import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    credits:{
      type:Number,
      required:true
    }
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
