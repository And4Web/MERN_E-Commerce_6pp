import {v2 as cloudinary} from 'cloudinary';

// export default cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// })

export const cloudinaryUpload = async function (image: string, p_id: string){
 try {  
  //configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

 //upload image
 const uploadResult = await cloudinary.uploader.upload(image, {public_id: p_id})

 console.log("cloudinary upload result >>> ", uploadResult.url);

  return uploadResult?.url
    
} catch (error) {
  console.log("Cloudinary upload error >>> ", error);
  return  "failed to upload image"
}
}

export const cloudinaryDelete = async function(p_id: string){
  //configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})
  // delete image
  const deleteResult = await cloudinary.uploader.destroy(p_id);

  console.log("cloudinary delete result >>> ", deleteResult);
}


// export default cloudinaryUpload;