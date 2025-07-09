const listing=require('./models/shema.js');
const Review=require('./models/review.js');
const expresserror = require('./utils/expresserror.js');

const {listingschema } = require('./shemajoi.js');
module.exports.isloggedin=(req,res,next)=>{
    console.log(req.session);
    if(!req.isAuthenticated()){
      req.session.redirectUrl  =req.originalUrl
        req.flash('error','you must be signed in first');
        return res.redirect('/login');
    }
    next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}
module.exports.isowner= async(req,res,next)=>{
     let { id } = req.params;
   // if (req.body.listings.image === '') {
   //    req.body.listings.image = undefined;
   //  }
   let Listing=await listing . findById(id);
if (!Listing.owner.equals( res.locals.curruser._id)){
   req.flash("error","you are not authorized to do that");
    return res.redirect(`/listing/${id}`)
  
}
  next();
}
module.exports.validatelisting=(req,res,next)=>{
   let{error}=listingschema.validate(req.body);
   if(error){

      let errmsg=error.details.map((el)=>el.message).join(',');
      throw new expresserror(400,errmsg );
   }else{
      next();
   }
 }
 module.exports.isauthor= async(req,res,next)=>{
     let { id,reviewid } = req.params;
   // if (req.body.listings.image === '') {
   //    req.body.listings.image = undefined;
   //  }
   let review=await Review . findById(reviewid);
if (!review.author.equals( res.locals.curruser._id)){
   req.flash("error","you are not authorized to do that");
    return res.redirect(`/listing/${id}`)
  
}
  next();
 }