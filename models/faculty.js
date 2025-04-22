const mongoose=require("mongoose");
const Department=require("./department.js");
const Feedback=require("./feedback.js");
const dept = require("../init/dept.js");
main().then(()=>{
    console.log("faculty is working well")
}).catch((err)=>{
    console.log(err)
})
async function main(){
        await mongoose.connect("mongodb://127.0.0.1:27017/facultyFeedback");
    
}

const facultySchema=new mongoose.Schema({
    name:String,
    email:String,
    department:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Department"
    },
    feedbacks:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Feedback"

    }],
    image:{
        type:String
    },
    specialization:String
});



const Faculty=mongoose.model("Faculty",facultySchema);
module.exports=Faculty;
// async function connectFeedback() {
//     let faculty=await Faculty.findOne({name:"shweta singh"});
//     let newFeedback=new Feedback({rating:2,comments:"worst teacher"});
//     await newFeedback.save();
//     faculty.feedbacks.push(newFeedback._id);
//     await faculty.save();
    
// }
// connectFeedback();


// async function showFeedback(){
//     const show=await Faculty.findOne({name:"shweta singh"}).populate("feedbacks");
//     console.log(show);

// }
// showFeedback();


// async function getFaculty(){
//     const dept=await Department.findOne({name:"CSE"});
//     const faculty=new Faculty({
//         name:"medha malik",
//         email:"medha@gmail.com",
//         department:dept._id
//     });
//     faculty.save();
// }
// getFaculty();
// async function findFaculty() {
//     const faculty=await Faculty.find().populate("department");
//     console.log(faculty[0]);
    
// }
// // findFaculty();