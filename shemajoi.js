const { name } = require('ejs');
const joi=require('joi');
module.exports. listingschema=joi.object({
    listings:joi.object({
    title:joi.string().min(3).max(30).required(),
    price:joi.number().required(). min(0),
    location:joi.string().required(),
    description:joi.string().required(),
    image:joi.string().allow("",null),
    country:joi.string().required(),
    category: joi.string().valid('trending', 'rooms', 'iconic-cities', 'mountains', 'castles', 'amazing-pools', 'camping', 'farms', 'arctic').required() // Add this line
  }).required()
    })

module.exports.reviewschema=joi.object({
    review:joi.object({
        name:joi.string().required(),
    rating:joi.number().required().min(1).max(5),
    comment:joi.string().required(),
}).required(),
})