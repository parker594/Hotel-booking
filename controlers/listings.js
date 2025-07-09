const listing=require('../models/shema.js');
 module.exports.index=async (req,res)=>{
    const alllisting=await listing.find({});
   //  console.log(data);
   
  res.render('listings/index.ejs', { listings:alllisting, selectedCategory: null });
};
module.exports.extra=async (req,res)=>{
    const listings=await listing.find({});
     res.render('listings/extra.ejs',{listings});
   
}