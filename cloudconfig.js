const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.SECRET_KEY
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
   allowerdFormats: ['png','jpeg','jpg'], // supports promises as well
   
  },
});
module.exports = {
  cloudinary,
    storage
};