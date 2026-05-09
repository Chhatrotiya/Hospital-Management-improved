import jwt from 'jsonwebtoken'

const authAdmin= async(req,res,next)=>{

    try{
       const {atoken}=req.headers
       if(!atoken){
        return   res.json({sucess:false,message:"Not authorized login again"})
       }
       const decode=jwt.verify(atoken,process.env.JWT_SECRET);
       if(decode !== process.env.ADMIN_PASSWORD + process.env.ADMIN_EMAIL){
        return   res.json({sucess:false,message:"Not authorized login again"})
       }
       next()
    }
    catch(err){
          console.log(err);
     res.json({sucess:false,message:err.message})

    }

}

export default authAdmin