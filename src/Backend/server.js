import express from "express"
import connectDB from './config/connectDB.js';
const app=express()
import path from 'path';
app.use(express.json())
connectDB()

const port=5000

app.listen(5000,(err)=>{
    err?console.log(err):console.log(`connected to Mongo Backend! ${port}`)
})