const express=require("express")
const router=express.Router()
const Product=require('../models/product')
const isAdmin=require('../middleware/isAdmin')
const isAuth=require('../middleware/isAuth')
//add new product
router.post('/add',isAuth,isAdmin,async(req,res)=>{
    const {design,desc,prix,qte,cat,image,inStock}=req.body
    try{
    const newProduct=new Product({design,desc,prix,qte,cat,image,inStock})
    const product = await newProduct.save()
    res.send({msg:"Product added",product})
    }
    catch(error){
        console.log(error)
    }
})
//Fetch product
router.get("/",async(req,res)=>{
    const product=await Product.find()
    res.send({msg:"product fetched",product})
})
//Fetch product by ID
router.get("/search/:id",async(req,res)=>{
    const {id}=req.params
    const product=await Product.findById({_id:id})
    res.send({msg:"product fetched",product})
})
//delete product
router.delete("/:id",isAuth,isAdmin,async(req,res)=>{
    const {id}=req.params
    const product = await Product.findOneAndDelete({_id:id})
    res.send({msg:"product deleted",product})
})
//Edit product
router.put("/edit/:id",isAuth,isAdmin,async(req,res)=>{
    const {id}=req.params
    const product = await Product.findOneAndUpdate({_id:id},{$set:req.body},{new:true})
    res.send({msg:"product edited",product})
})

module.exports=router