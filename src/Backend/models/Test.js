const mongoose=require("mongoose")
const schema=mongoose.Schema

const testSchema=new schema({
    Scenario:{
        type:String
    },
    desc:{
        type:String
    },
    prix:{
        type:String
    }, 
    qte:{
        type:String
    },
    cat:{
        type:String
    },
    image:{
        type:String
    },
    inStock:{
        type:Boolean,
        default: true
    }
    
},
{ timestamps:true}   
)
module.exports=Test=mongoose.model("tests",testSchema)