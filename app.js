const express=require("express");
const app=express();
const path=require("path");
const methodOverride=require("method-override");
const Faculty=require("./models/faculty.js");
const Department=require("./models/department.js");
const Feedback = require("./models/feedback.js");
const ejsMate=require("ejs-mate");
const session=require("express-session");
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");
const {isLoggedInAsFaculty}=require("./middleware.js");
const{isLoggedIn}=require("./middleware.js");
const flash=require("connect-flash");
const wrapAsync=require("./errorHandlers/wrapAsync.js");
const ExpressError=require("./errorHandlers/expressError.js");

app.engine('ejs',ejsMate);




app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
//IMPLEMENT PASSPORT AUTHENTICATION

const sessionOption={
    secret:"mysecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
      expires:Date.now()+2*24*60*60*1000,
      maxAge:2*24*60*60*1000,
      httpOnly:true
    },
    
}
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  next();
})


//----------------------------USER-------------------------
app.get("/signup",async(req,res)=>{
    res.render("users/signup.ejs");
});
app.post("/signup",async(req,res)=>{
    let{username,email,password,role}=req.body;
    let newUser=new User({email,username,role});
   const registeredUser=await User.register(newUser,password);

    console.log(registeredUser);
    res.send("New User Registered Successfully!!");
});
app.get("/login",async(req,res)=>{
    res.render("users/login.ejs");
});
app.post(
    "/login",
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    async (req, res) => {
     // You could compare req.body.role (from login form) with req.user.role
      const selectedRole = req.body.role;
      const actualRole = req.user.role;
  
      if (selectedRole !== actualRole) {
        req.logout(err => {
          if (err) return next(err);
          
          return res.redirect("/login");
        });
      } else {
        res.send(`Welcome ${req.user.username}! You are logged in as ${actualRole}`);
        
      }
    }
  );
  app.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        res.redirect("/showDept");

    })
  })


//ROOT ROUTE
app.get("/",(req,res)=>{
    res.send("Root is working well");
    
});

//ADD A NEW FACULTY
app.get("/faculty/new",isLoggedInAsFaculty,(req,res)=>{
    res.render("new.ejs");
});
app.post("/faculty/new",wrapAsync(async(req,res)=>{
    let{name,department,email,image,specialization}=req.body;
    let dept=await Department.findOne({name:department});

    let newfaculty=new Faculty({name:name,email:email,department:dept._id,specialization:specialization,image:image});
    await newfaculty.save();
    dept.faculty.push(newfaculty._id);
    await dept.save();
    req.flash("success","New faculty saved successfully!!");
   res.redirect("/showDept");

    console.log(newfaculty);
}));




//SHOW ALL DEPARTMENTS OF COLLEGE
app.get("/showDept",async(req,res)=>{
    const department=await Department.find({});
   req.flash("success","Welcome to ABES ENGINEERING COLLEGE!!");
    res.render("show.ejs",{department});
})
//ADD NEW DEPARTMENT
app.get("/dept/new",isLoggedInAsFaculty,async(req,res)=>{
   
        res.render("newDept.ejs");

  
});
app.post("/dept/new",wrapAsync(async(req,res)=>{
    let newDept=new Department(req.body);
    await newDept.save();
    res.redirect("/showDept");
}))
//ADD FEEDBACK
app.get("/feedback/faculty/:id",isLoggedIn,async(req,res)=>{
    let{id}=req.params;
    let faculty=await Faculty.findById(id);
    res.render("feedback.ejs",{faculty});
});
app.post("/feedback/faculty/:id",wrapAsync(async(req,res)=>{
    let{id}=req.params;
    const faculty=await Faculty.findById(id).populate("feedbacks");
    const feedback=new Feedback({ratings:req.body.ratings,facultyId:id});
    await feedback.save();
    faculty.feedbacks.push(feedback._id);
    await faculty.save();
    const updatedFaculty = await Faculty.findById(id).populate("feedbacks");
    // updatedFaculty.feedbacks.forEach(fb => console.log(fb.ratings));
    console.log(updatedFaculty.feedbacks);

   res.send("sent!!");

}))





//SHOW FACULTIES OF RESPECTIVE DEPARTMENT
app.get("/dept/:id",async(req,res)=>{
    let{id}=req.params;
    const department=await Department.findById(id).populate("faculty");
    if(!department){
        return res.status(404).send("Department not found");
    }
    res.render("showFaculty.ejs",{department});
    // res.send(`department is ${department.name} with id ${department.id}`);
});
//SHOW DETAILS OF FACULTY
app.get("/faculty/:id",async(req,res)=>{
    let{id}=req.params;
    let faculty=await Faculty.findById(id).populate("department").populate("feedbacks");
    let arr=[];
    let avgRatings;
    if(faculty.feedbacks.length>0){
      faculty.feedbacks.forEach(feedback=>{
   

        let obj=feedback.ratings.toObject();//THIS IS MONGOOSE OBJECT AND WE HAVE CONVERT IT INTO JS OBJECT
      if(typeof obj.overallRating=='number'){
        
        arr.push(obj.overallRating);
      }    
      })

    // console.log(arr);
    let sum=arr.reduce((acc,num)=>acc+num,0);
console.log("Average Rating: "+sum/arr.length);
avgRatings=sum/arr.length;

    }
   
    res.render("facultyDetail.ejs",{faculty,avgRatings});
});
//IF FACULTY IS DELETE THEN IT SHOULD BE DELETE FROM DEPARTMENT TOO
app.delete("/dept/:id/faculty/:facultyId",isLoggedInAsFaculty,wrapAsync(async(req,res)=>{
    let{id,facultyId}=req.params;
    await Department.findByIdAndUpdate(id,{$pull:{faculty:facultyId}});
    await Faculty.findByIdAndDelete(facultyId);
    res.redirect(`/dept/${id}`);

}))

//DELETE THE DEPERTMENT
app.delete("/dept/:id",wrapAsync( async (req, res) => {
    let { id } = req.params;
    
    // First, delete all faculties in the department
    await Faculty.deleteMany({ department: id });

    // Then, delete the department itself
    await Department.findByIdAndDelete(id);
    req.flash("success","Department Deleted successfully!!")

    res.redirect("/showDept"); // Redirect to department list after deletion
}));
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"page not found"));

})
app.use((err, req, res, next) => {
let{statusCode=500,message="something went wrong"}=err;
res.status(statusCode).send(message);
  });

app.listen(2025,()=>{
    console.log("App is listening on port 2025");
});