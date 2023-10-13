import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
    },
    credits:{
      type:Number,
      required:true,
      default: 10
    },
    last_modified:{
      type:String,
    }
  }
);

const User = mongoose.model("User", userSchema);
export default User;
