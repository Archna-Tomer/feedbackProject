const mongoose=require("mongoose");
const Department=require("./department.js");

async function main(){
        await mongoose.connect("mongodb://127.0.0.1:27017/facultyFeedback");
    
}
main();
const studentSchema=new mongoose.Schema({
    name:{
        type:String
    },
    email:String,
    department:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Department"
    }
});
const Student=mongoose.model("Student",studentSchema);

async function getStudent(){
    const dept=await Department.findOne({name:"ECE"});
    const newStudent=new Student({
        name:"Antim",
        email:"antim@gmail.com",

        department:dept._id

    });
   await  newStudent.save();

}
// getStudent();
async function findStudent(){
    const student=await Student.find({}).populate("department");
    console.log(student[1]);
}
// findStudent();