 if (process.env.NODE_ENV !== 'production') {
   require('dotenv').config();
   console.log(process.env.SECRET);
} else {
   console.log('Running in production mode or local development');
}
 
 const express=require ('express');
 const app=express();
 const mongoose=require('mongoose');
 const listing=require('./models/shema.js');
//   const review=require('./models/review.js');
//const mongourl='mongodb://127.0.0.1:27017/wonderla';
const dburl=process.env.mongoatlas ;
//const dburl = mongourl; // Using local MongoDB
 const path=require('path');
 const ejs=require('ejs');
 const methodOverride = require('method-override');
 const ejsmate=require('ejs-mate'); 
 const session = require('express-session');
 const MongoDBStore = require('connect-mongo');
 const flash = require('connect-flash');

app.use(methodOverride('_method'));
const wrapasync=require('./utils/wrapasync.js');
const expresserror=require('./utils/expresserror.js');
const { listingschema ,reviewschema} = require('./shemajoi.js');
app.use('/node_modules', express.static(__dirname + '/node_modules'));
const listingrouter=require('./router/listing.js');
const reviewrouter=require('./router/reviewrouter.js');
const signinrouter=require('./router/sign.js');
const { lutimes } = require('fs');
const passport = require('passport');
const LocalStrategy = require('passport-local');
 const User = require('./models/user.js');
const { sign } = require('crypto');
const MongoStore = require('connect-mongo');
 main()
 .then(()=>{console.log(' db connected')})
 .catch((err)=>{console.log(err)})

 async function main(){
    await mongoose.connect(dburl)

 }
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
 app.use(express.urlencoded({extended:true}));
 app.engine('ejs',ejsmate);
  app.use(express.static(path.join(__dirname,'public')));
  const validatelisting=(req,res,next)=>{
   let{error}=listingschema.validate(req.body);
   if(error){

      let errmsg=error.details.map((el)=>el.message).join(',');
      throw new expresserror(400,errmsg );
   }else{
      next();
   }
 }
  const store = MongoStore.create({
   mongoUrl: dburl, // Now using local MongoDB
   collection: 'sessions',
   touchAfter: 24 * 3600, // time period in seconds
   crypto: {
       secret: process.env.SECRET || 'fallback-secret-key-for-local-dev', // Fallback for local development
 }  })
   store.on('error', ()=> {
   console.log('SESSION STORE ERROR');
   });
 const sessionoption = {
   store,
   secret : process.env.SECRET || 'fallback-secret-key-for-local-dev', // Fallback for local development
   resave : false,
   saveUninitialized : true,
   cookie :{
expires: Date.now ()+1000*60*60*24*7, // 7 days
maxAge : 1000*60*60*24*7, // 7 days
httpOnly : true,
   }

   
  }
 
 app.use(session(sessionoption));
app.use(flash());
app.use (passport.initialize());
app.use (passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
   res.locals.success=req.flash('success');
   res.locals.error=req.flash('error');
   res.locals.curruser=req.user;
   next();
})
app.get('/favicon.ico', (req, res) => res.status(204).send());
app.get('/',wrapasync((req,res,next)=>{
 res.redirect('/listing');
 }))//listings

// app.get("/demouser", async(req, res) => {
//    let fakeuser={
// email:"debajyotiupadhayaya@gmail.com",
// username:"debajyoti",
//    }
//     let reg= await User.register(fakeuser,"12345678");
//     res.send(reg)
// })
// ;
  app.use('/listing',listingrouter);
  app.use("/listing/:id/reviews", reviewrouter);
  app.use('/',signinrouter);
  
 
 

//  A POST ROUTE FOR REVIEWS


//new things are asinged to listing
app.use((req, res, next) => {
   console.log("Request URL:", req.originalUrl);
   next();
 });

app.all('*', (req,res,next)=>{
   next(new expresserror(404,'page not found'));
})
app.use((err,req,res,next)=>{
   let{statuscode=400,message="something went wrong"}=err;
   console.log("touched error");
   console.log(err);
   res.status(statuscode).render('error',{message});
   console.log("touched error page");
   
});
   //  res.status(statuscode).send(`Something went wrong: ${err.message}`);
 app.listen(8000,()=>{
    console.log('your server is running in port 8000')
 })