const mongoose=require("mongoose");
const Faculty = require("./faculty");
main();
async function main(){
            await mongoose.connect("mongodb://127.0.0.1:27017/facultyFeedback");
}
const feedbackSchema=new mongoose.Schema({
  facultyId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Faculty"
  },
  studentId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Student"
  },
  ratings:{
    handlingStudents:Number,
    discipline:Number,
   livelyClass:Number,
   availability:Number,
   clarity:Number,
   contentDelivery:Number,
   contentRelevance:Number,
   presentation:Number,
   overallTeaching:Number,
  overallRating:Number

  

  },
});
const Feedback=mongoose.model("Feedback",feedbackSchema);
module.exports=Feedback;
// async function getFeedback(){
//     const feedback=new Feedback({ratings:{handlingStudents:4,discipline:3}});
//    await feedback.save();


// }
// getFeedback();
// async function addFaculty(){
//     const faculty=await Faculty.findOne({name:"shweta singh"});
//     const feedback=new Feedback({ratings:{discipline:5,handlingStudents:5}});
//    await  feedback.save();
//     faculty.feedbacks.push(feedback._id);
//     await faculty.save();
// }
// addFaculty();
// async function findfeedback(){
//     const faculty=await Faculty.findOne({name:"shweta singh"}).populate("feedbacks");
//     console.log(faculty.feedbacks);
// }
// findfeedback();

// async function getFeedback(){
//     const newFeedback=new Feedback({rating:4,comments:"nice teacher!!"});
//     newFeedback.save();
// }
// getFeedback();