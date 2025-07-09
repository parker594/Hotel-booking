const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const reviewschema=new Schema({
    name:String,
    comment:String,
    rating :{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
})
module.exports=mongoose.model('review',reviewschema);