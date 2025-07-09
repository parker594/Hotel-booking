const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const review=require('./review.js');
const { ref } = require('joi');
const listingSchema=new Schema({
title :{
  type:  String,
    required: true
},
description:String,
price:Number,
location:String,
country:String,
image:{
   url: String,
 filename:String
},

reviews:[{
    // comment:String,
    type: Schema.Types.ObjectId,
    ref: 'review'
}],
owner:{
   type:Schema.Types.ObjectId,
   ref:"User"

},
 category: {
    type: String,
    enum: ['trending', 'rooms', 'iconic-cities', 'mountains', 'castles', 'amazing-pools', 'camping', 'farms', 'arctic'],
    default: 'trending'
  },
})
listingSchema.post('findOneAndDelete',async(listing)=>{
    if(listing.reviews.length){
        const result=await review.deleteMany({_id:{$in:listing.reviews}});
        console.log(result);
    }
  

})
 const listing=mongoose.model('listing',listingSchema);
module.exports=listing;