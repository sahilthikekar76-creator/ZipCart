const express=require('express')
const multer=require('multer')
const cloudinary=require('cloudinary').v2;
const streamifier=require("streamifier");

require("dotenv").config();
const router=express.Router();
//cloudinary confirmation
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

//multer setup using memory  storage
const storage=multer.memoryStorage();
const uplod=multer({storage});

router.post("/",uplod.single("image"),async(req,res)=>{
    try {
        if(!req.file){
            return res.status(400).json({message:"No file uploded"});
        }

        //if function to handle the stream uplod the cloudinary
        const streamUpload=(fileBuffer)=>{
            return new Promise((resolve,reject)=>{
                const stream=cloudinary.uploader.upload_stream((error,result)=>{
                    if(result){
                        resolve(result);
                    }else{
                        reject(error);
                    }
                });
                //streamifier to convert file buffer to string
                streamifier.createReadStream(fileBuffer).pipe(stream);
            });
        }
        //call streamuplod function
        const result=await streamUpload(req.file.buffer);
        //respond with the uploaded image url
        res.json({imageUrl:result.secure_url});
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server error"});
    }
});
module.exports=router;