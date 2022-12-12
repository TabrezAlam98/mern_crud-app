const express=require("express");

const {TodosModel}=require("../Model/todos.model")

const todosRouter=express.Router();

todosRouter.get("/",async(req,res)=>{
    const todos=await TodosModel.find()
    res.send(todos)
})

todosRouter.post("/create",async(req,res)=>{
    const payload=req.body;
    try{
    const data=new TodosModel(payload)
    await data.save()
    res.send("Todos created")
    }
    catch(err){
        res.send("something went wrong")
    }
})

todosRouter.put("/update/:todosId",async(req,res)=>{
    const todosId=req.params.todosId;
    const payload=req.body;
    try{
        await TodosModel.findByIdAndUpdate({_id:todosId},payload)
        res.send("Todos updated")

    }catch(err){
        res.send("something went wrong")
    }
})

todosRouter.delete("/delete/:id",async(req,res)=>{
    const id=req.params.id;
    const todos=await TodosModel.findByIdAndDelete({_id:id})
    res.send("todos deleted")
})
module.exports={todosRouter}