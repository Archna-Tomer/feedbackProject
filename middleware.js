module.exports.isLoggedInAsFaculty=async(req,res,next)=>{
    if(!req.isAuthenticated() || req.user.role!=="Faculty"){
   req.flash("error","You are not authorized to make changes!!");
   return res.redirect("/login");


      


    }
    next();

}
module.exports.isLoggedIn=async(req,res,next)=>{
    if(!req.isAuthenticated()){
  req.flash("error","You need to login to proceed further!!");

        return res.redirect("/login");
    }
    next();
}