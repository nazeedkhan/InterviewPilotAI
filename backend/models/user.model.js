import mongoose from "mongoose";

// basic schema for user naam, email, credit and id by default. password nahi hai kyuki firebase use kr rahe hai or wo password return nahi krta response me.
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    credit:{
        type:Number,
        default:100
    }
}, { timestamps: true });

const userModel = mongoose.model("user", userSchema);

export default userModel;
