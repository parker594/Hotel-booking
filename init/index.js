const mongoose = require('mongoose');
const initdata=require("./data.js");
const listing=require('../models/shema.js');
const mongourl='mongodb://127.0.0.1:27017/wonderla';
const User = require('../models/user.js');
 main()
 .then(()=>{console.log(' db connected')})
 .catch((err)=>{console.log(err)})

 async function main(){
    await mongoose.connect(mongourl)

 }
 
 const initdb=async()=>{
await listing.deleteMany({});

  let user = await User.findOne({ username: "admin" });
  if (!user) {
    user = new User({ username: "admin", email: "admin@example.com" });
    await User.register(user, "password123"); // If using passport-local-mongoose
  }

  // Assign this user's _id as owner for all listings
  const dataWithOwner = initdata.data.map(obj => ({
    ...obj,
    owner: user._id
  }));
await listing.insertMany(dataWithOwner); 
console.log("data inserted");

// Add this after inserting listings:
const admin = await User.findOne({ username: "admin" });
if (admin) {
  await listing.updateMany({}, { owner: admin._id });
}
// initdata.data=initdata.data.map((obj)=> ({...obj,owner:"682f657883770212104f6207"}))

}
initdb();