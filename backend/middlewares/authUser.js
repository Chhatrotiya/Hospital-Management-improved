import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'

const authUser= async(req,res,next)=>{

    try{
       const {token}=req.headers
       if(!token){
        return res.status(401).json({success:false,message:"Not authorized login again"})
       }
       const decode=jwt.verify(token,process.env.JWT_SECRET);
       const user=await userModel.findById(decode.id).select('_id');

       if(!user){
        return res.status(401).json({
            success:false,
            accountDeleted:true,
            message:"Your account has been deleted"
        })
       }

       if(!req.body) req.body={};
       req.body.userId=decode.id;
       next()
    }
    catch(err){
          console.log(err);
     res.status(401).json({success:false,message:"Not authorized login again"})

    }

}

export default authUser
