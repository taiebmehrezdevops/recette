import mongoose from 'mongoose';
import config from 'config';
export default function connectDB() {connectDB=()=>{
    mongoose.connect(config.get("MONGO_URI"))
    .then(()=>console.log("mongoose connected"))
    .catch((err)=>console.log(err))
}
}