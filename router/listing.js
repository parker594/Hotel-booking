const express=require('express');
const router=express.Router();
const wrapasync=require('../utils/wrapasync.js');
const expresserror=require('../utils/expresserror.js');
const { listingschema ,reviewschema} = require('../shemajoi.js');
const listing=require('../models/shema.js');
const review=require('../models/review.js');

const { isloggedin, isowner,validatelisting}=require('../middileware.js');
const listingowner=require("../controlers/listings.js");
const multer  = require('multer')
const { storage } = require('../cloudconfig.js'); // Assuming you have a cloudconfig.js for cloudinary
const upload = multer({ storage })

// const validatelisting=(req,res,next)=>{
//    let{error}=listingschema.validate(req.body);
//    if(error){

//       let errmsg=error.details.map((el)=>el.message).join(',');
//       throw new expresserror(400,errmsg );
//    }else{
//       next();
//    }
//  }

 //indexroute

router.route("/").get(wrapasync(listingowner.index))
.post( isloggedin, upload.single('listings[image]'),validatelisting,wrapasync(async( req, res) => {
  let url =req.file.path;
  let filename =req.file.filename;

 
   
      const newlistings = new listing({
         ...req.body.listings,
      });
      newlistings.owner=req.user._id;
      newlistings.image={url,filename}
     req.flash('success','listing created');
      await newlistings.save();
      res.redirect("/listing");
   
     
   }));;
 //new route
 

 router.get('/extra', isloggedin,wrapasync(listingowner.extra));
router.get('/category/:category', wrapasync(async (req, res) => {
  const { category } = req.params;
  const listings = await listing.find({ category: category });
  res.render('listings/index.ejs', { listings, selectedCategory: category });
}));
router.get('/:id', wrapasync(async (req,res)=>{
    const {id}=req.params;
    const listings=await listing.findById(id).populate({path:'reviews',populate:{path:'author'}}).populate('owner');
    if (!listings){
        req.flash('error','listing not found');
        return res.redirect('/listing');
    } 
    console.log(listings)
    res.render('listings/show.ejs',{listings});
}));

router.get("/:id/edit",isowner, isloggedin,wrapasync( async (req, res,next) => {
   let { id } = req.params;
   const listings = await listing.findById(id);
   if (!listings){
        req.flash('error','listing not found that you want to edit');
        return res.redirect('/listing');
    }
   res.render("listings/edit.ejs", { listings });
 }));
// Add this route for category filtering


// Keep your existing routes unchanged

 router.put("/:id", upload.single('listings[image]'),validatelisting,wrapasync( async (req, res) => {
   let { id } = req.params;
   // if (req.body.listings.image === '') {
   //    req.body.listings.image = undefined;
   //  }
    let Listing=await listing.findByIdAndUpdate(id, { ...req.body.listings });
  if(  typeof req.file!="undefined" ){
    
  
   let url =req.file.path;
  let filename =req.file.filename;
    Listing.image={url,filename};
    await Listing.save();
   } 
    req.flash('success','listing updated');
  
   res.redirect(`/listing/${id}`); // redirect to the updated listing page
 }) );
 router.delete("/:id", isowner,isloggedin,wrapasync( async (req, res,) => {
   let { id } = req.params;
   let deletedListing = await listing.findByIdAndDelete(id);
   console.log(deletedListing);
    req.flash('success','listing deleted');
   res.redirect("/listing");
 })
);

module.exports=router;
