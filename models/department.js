const {deptData}=require("../init/dept.js");
const Faculty=require("./faculty.js");



const mongoose=require("mongoose");
main().then(()=>{
    console.log("Database connected");
})
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/facultyFeedback");
}
const departmentSchema=new mongoose.Schema({
    code:{
        type:Number,
        unique:true
    },
    name:{
        type:String,
        unique:true
    },
   faculty:[{
      type:mongoose.Schema.Types.ObjectId,
    ref:"Faculty"
   }],
   image:{
    type:String
   }
});
// departmentSchema.post("findOneAndDelete",async(department)=>{
//     if(department){
//         console.log(department.faculty);
//         console.log(Faculty);
        
//     await Faculty.deleteMany({ _id: { $in: department.faculty } });
    

//     }

// })
// departmentSchema.post("findOneAndDelete", async (department) => {
//     if (department && Array.isArray(department.faculty) && department.faculty.length > 0) {
//         console.log("Deleting faculties:", department.faculty);
//         await Faculty.deleteMany({ _id: { $in: department.faculty } });
//     }
// });
const Department=mongoose.model("Department",departmentSchema);
module.exports=Department;

// async function getDept(){
//     await Department.deleteMany({});

//     await Department.insertMany(deptData);
// }
// getDept();
// async function connectFcultyToDepartment(){
//     const dept=await Department.findOne({name:"ECE"});
//     const facc=await Faculty.findOne({name:"faculty1"});
//     await facc.save();
//     dept.faculty.push(facc._id);

//     await dept.save();



// }
// async function allDepartment(){
//     const dept=await Department.find({});
//     console.log(dept);
// }
// allDepartment();
// connectFcultyToDepartment();