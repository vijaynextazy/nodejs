const express = require('express');
const app = express();
const mongoose = require('mongoose');

const registerSchema = require('./schema/userRegister');
const userPostSchema = require('./schema/userPosts')

app.use(express.json())

mongoose.connect('mongodb://localhost:27017/usersdb', {  useNewUrlParser: true}, {useUnifiedTopology: true})
.then(()=>{
    console.log('db Connected')
}, (err)=>{
    console.Console.log('db not connected' + err)
})

app.listen(3000, ()=>{
    console.log('Server started')
})
//Register user

app.post('/register', async (req,res)=>{
    
    const userRegister = new registerSchema({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })


    try {

        await userRegister.save()
        res.status(200).json({success: true, data:userRegister})
        
    } catch (error) {
        res.status(400).json({success: false, message: 'someThing went wrong'})
    }
})

//get All user

app.get('/', async (req,res)=>{

    const getAllUser = await registerSchema.find()
        
    try {
        
        res.status(200).json({success: true, data:getAllUser})

    } catch (error) {
        res.status(400).json({success: false, message:'Something wrong'})
    }
})

//Post Product 

app.post('/posts', async (req,res)=>{
       try {
        let userId = await registerSchema.findOne({ _id: req.body.user_id})
        console.log("userId-------------------->",userId)
         if(userId) {
             const createPosts = new userPostSchema({
                 name: req.body.name,
                 image:req.body.image,
                 description: req.body.description,
                 location: req.body.location,
                 user_id: req.body.user_id
               })
               if(!createPosts) return res.status(400).json({success: false, message: "post cannot be created"})
             
              await createPosts.save();
             res.status(200).json({success: true, data:createPosts})
         } else {
             return res.status(400).json({success: false, message: "user not found"})
         }
       } catch (error) {
           console.log("error------------------->", error)
           res.status(400).send("error------------------->", error);
       }    
})
//updateProducts
app.put('/posts/:id' , async(req,res)=>{
  
   try {
        let userId = await registerSchema.findOne({_id: req.body.user_id})
        if(!userId){
            await res.status(400).send({success:false, message: 'user id not found'})
        }
        let productUpdate = await userPostSchema.findByIdAndUpdate({_id: req.params.id}, req.body)

        if(!productUpdate){
            await res.status(400).send({success:false, message: 'Product cannot be created'})
        }
          
        else{
             await productUpdate.save();
            res.status(200).send({success:true, message: 'product updated', data: productUpdate})
        }
   } catch (error) {
       res.status(500).send("some think went wrong", error)
   }
    
})
//get All posts
app.get('/posts', async (req,res)=>{
     let allPosts = await userPostSchema.find()

     try {

        if(!allPosts){
            res.status(400).send({success: false, message:'Product cannot to fetched'})
        }
        else{
            res.status(200).json({success: false, data:allPosts})
        }
         
     } catch (error) {
        res.status(500).send('Product cannot to fetched')
     }
})

//Delete Product

app.delete('/posts/:id', async (req,res)=>{

    let userId = await registerSchema.findOne({_id: req.body.user_id})

    if(!userId){
        await res.status(400).send({success:false, message: 'user id not found'})
    }
    let productDelete = await userPostSchema.findByIdAndDelete({_id: req.params.id})

    if(!productDelete){
        await res.status(400).send({success:false, message: 'Product cannot be Deleted'})
    }
      
    else{
         await productDelete.save();
        res.status(200).send({success:true, message: 'product deleted'})
    }
})

//getUserBased Product

app.get('/posts/:id', async (req,res)=>{

    let userId = await registerSchema.findOne({user_id: req.params.id})

    try {

        if(!userId){
            await res.status(400).send({success:false, message: 'user id not found'})
        }

        let getUserProduct = await userPostSchema.findOne({_id: req.body.categoryId})

        if(!getUserProduct){
            await res.status(400).send({success:false, message: 'Product Id not found'})
        }

        else{
           res.status(200).json({success:true, data: getUserProduct})
        }
        
    } catch (error) {
        res.status(500).send('Something went wrong')
    }
})