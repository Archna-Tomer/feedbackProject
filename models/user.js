const mongoose=require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose");
const userSchema=new mongoose.Schema({
  role:{
    type:String,
    enum:["Student","Faculty"],
    required:true
  },
  email:{
    type:String,
    required:true
  }
    
});
userSchema.plugin(passportLocalMongoose);
const User=mongoose.model("User",userSchema);
module.exports=User;