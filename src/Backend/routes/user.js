const express=require("express")
const User=require("../models/user")
const router=express.Router()
const bcrypt=require("bcrypt")
var jwt = require('jsonwebtoken')
const isAuth=require("../middleware/isAuth")
//register new user
router.post("/register",async(req,res)=>{
    const{name,lastName,address,tel,email,password,isAdmin}=req.body
    try{
    let user= await User.findOne({email})
    if(user){
        res.send({msg:"user exist"})
    }
    user=new User({
        name,lastName,address,tel,email,password,isAdmin
    })
    const salt=10
    let hashedPassword= await bcrypt.hash(password,salt)
    user.password=hashedPassword
    await user.save()
    const payload={
        id:user._id
    }
    var token = jwt.sign(payload, 'shhhhhh');
    res.send({msg:"user added",user,token})
    }
    catch(err){
        console.log(err)
    }
})
//login
router.post("/login",async(req,res)=>{
    const{email,password}=req.body
    try{
    let user=await User.findOne({email})
    if(!user){
        res.send({msg:"user not found"})
    }
    let isMatch= await bcrypt.compare(password,user.password)
    if(!isMatch){
        res.send({msg:"bad credentials ! password"})
    }
    const payload={
        id:user._id
    }
    var token = jwt.sign(payload, 'shhhhhh');
    res.send({msg:"user logged",user,token})
}
catch(err){
    console.log(err)
}
})
router.get("/user",isAuth,(req,res)=>{
    res.send({user:req.user})
})
module.exports=router