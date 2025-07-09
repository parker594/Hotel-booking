const express= require('express');

const router=express.Router({mergeParams:true});
const mongoose=require('mongoose');
const User = require('../models/user.js');
const wrapasync = require('../utils/wrapasync.js');
const passport = require('passport');
const {saveRedirectUrl} =require("../middileware.js");
router.get('/signup',(req,res)=>{
    res.render('user/signup.ejs');
})

router.post('/signup', wrapasync (async(req,res)=>{
  try{  
    const {username,email,password}=req.body;
    const newuser=new User({username,email});
    const userregister=await User.register(newuser,password);
    console.log(userregister);
    req.login(userregister,(err)=>{
        if(err){
            return next(err);
        }
         req.flash("success","user is registered");
    res.redirect(req.session.redirectUrl||"/listing");
    });
   
}catch(err){
    req.flash("error",err.message);
    res.redirect('/signup');
}
}))
router.get('/login',(req,res)=>{
    res.render('user/login.ejs');
    
})
 
router.post('/login' ,saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login' ,failureFlash:true}), async(req,res)=>{
req.flash("success" ,"welcome back");
let redirecturl=res.locals.redirectUrl||"/listing";
res.redirect(redirecturl);
})
router.get ("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
         return next(err);   
        }
       req.flash("success","you are logout");
       res.redirect("/listing");
    }
)
})
module.exports=router;