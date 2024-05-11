import {v2 as cloudinary} from 'cloudinary';

async function cloudinaryUpload(image: string, p_id: string){
  //configuration
  cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

//upload image
const uploadResult = await cloudinary.uploader.upload(image, {public_id: p_id}).catch(err=>console.log(err));

// console.log("cloudinary upload result >>> ", uploadResult);

return uploadResult
}

export default cloudinaryUpload;