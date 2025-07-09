const express=require('express');

const router=express.Router({mergeParams:true});
const wrapasync=require('../utils/wrapasync.js');
const expresserror=require('../utils/expresserror.js');
const { reviewschema} = require('../shemajoi.js');
const listing=require('../models/shema.js');
const review=require('../models/review.js');
const {  isloggedin, isauthor}=require('../middileware.js');
const validatereview=(req,res,next)=>{
   let{error}=reviewschema.validate(req.body);
   if(error){

      let errmsg=error.details.map((el)=>el.message).join(',');
      throw new expresserror(400,errmsg );
   }else{
      next();
   }
 }
router.post('/',isloggedin, validatereview,wrapasync( async (req, res) => {
let listings=await listing.findById(req.params.id);
let reviewdata=new review(req.body.review);
 reviewdata.author=req.user._id;
 console.log(reviewdata);
listings.reviews.push(reviewdata);
await listings.save();
await reviewdata.save();
console.log(reviewdata);
 req.flash('success','new review created');
 return res.redirect(`/listing/${req.params.id}`);
// res.send("your review is added successfully");
}))
router.delete('/:reviewid',isloggedin,isauthor,wrapasync(async(req,res)=>{
   let {id,reviewid}=req.params;
   await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
   await review.findByIdAndDelete(reviewid);
    req.flash('success','review deleted');
   res.redirect(`/listing/${id}`);
}))
module.exports=router;
//