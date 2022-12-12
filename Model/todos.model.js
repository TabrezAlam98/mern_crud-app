const mongoose=require("mongoose");

const todosSchema=mongoose.Schema({
    title:String,
    desc:String,
    userID:String,

})

const TodosModel=mongoose.model("todo",todosSchema)
module.exports={TodosModel}