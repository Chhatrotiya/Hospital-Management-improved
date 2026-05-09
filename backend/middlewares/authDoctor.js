import jwt from 'jsonwebtoken'

const authDoctor= async(req,res,next)=>{

    try{
       const {dtoken}=req.headers
       if(!dtoken){
        return   res.json({sucess:false,message:"Not authorized login again"})
       }
       const decode=jwt.verify(dtoken,process.env.JWT_SECRET);
       if(!req.body) req.body={};
       req.body.docId=decode.id;
       next()
    }
    catch(err){
          console.log(err);
     res.json({sucess:false,message:err.message})

    }

}

export default authDoctor