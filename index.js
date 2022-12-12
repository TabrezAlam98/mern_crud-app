const express=require("express");
const {UserModel}=require("./Model/user.model")
const {connection}=require("./config/db")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config()
const {todosRouter}=require("./routes/todos.routes")
const {authenticate}=require("./middleware/authentication")
const cors = require('cors')
const app=express();
app.use(express.json())
app.use(cors({
    origin : "*"
}))

app.get("/",async(req,res)=>{
    const data=await UserModel.find()
    res.send(data)
})


app.post("/signup", async (req, res) => {
    const {email, password,name} = req.body;
    const userPresent = await UserModel.findOne({email})
    if(userPresent){
        res.send("Try loggin in, already exist")
    }
    try{
        bcrypt.hash(password, 4, async function(err, hash) {
            const user = new UserModel({email,password:hash,name})
            await user.save()
            res.send("Sign up successfull")
        });
       
    }
   catch(err){
        console.log(err)
        res.send("Something went wrong, pls try again later")
   }
})
 

app.post("/login", async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await UserModel.find({email})
         
      if(user.length > 0){
        const hashed_password = user[0].password;
        bcrypt.compare(password, hashed_password, function(err, result) {
            if(result){
                const token = jwt.sign({"userID":user[0]._id}, 'hush');
                res.send({"msg":"Login Successfull","token" : token})
            }
            else{
                res.send("Login failed")
            }
      })} 
      else{
        res.send("Login failed")
      }
    }
    catch{
        res.send("Something went wrong, please try again later")
    }
})
 

app.use(authenticate)
app.use("/todos",todosRouter)

app.listen(process.env.PORT,async()=>{
    try{
      await connection;
        console.log("Connected to DB successfully")
    }
    catch(err){
        console.log(err);
        console.log("Something went wrong")

    }
    console.log(`listening on port ${process.env.PORT}`)
})