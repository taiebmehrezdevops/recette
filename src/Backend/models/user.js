const mongoose=require("mongoose")
const schema=mongoose.Schema

const userSchema=new schema({
    name:{
        type:String
    },
    lastName:{
        type:String
    },
    address:{
        type:String
    },
    tel:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
},
    { timestamps: true} 
);

const User = mongoose.model("User", userSchema);
module.exports = User;