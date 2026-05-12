import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import razorpay  from 'razorpay';

const registerUser= async(req,res)=>{
    try {

        const {name,email,password}=req.body;

        if(!name || !email || !password){
            res.json({success:false,message:"missing detail"})
        }

        if(!validator.isEmail(email)){
            res.json({success:false,message:"Enter a valid email"})
        }

        if(password.length<8){
            res.json({success:false,message:"enter a strong password"})
        }

        const salt=await bcrypt.genSalt(5);
        const hashedPassword=await bcrypt.hash(password,salt);

        const  userData={
            name,
            email,
            password:hashedPassword,
        }
   
        const newUser= new userModel(userData);
      const user = await newUser.save();

      const token= jwt.sign({id:user._id},process.env.JWT_SECRET);

      res.json({success:true,token})

    } catch (err) {

        console.log(err);
        res.json({success:false,message:err.message})
        
    }
}

const loginUser= async(req,res)=>{
    try {
        
     const {email,password}=req.body;
     const user=await userModel.findOne({email});

     if(!user){
       return  res.json({success:false,message:'user does not exist'}) 
     }
    
     const isMatch= await bcrypt.compare(password,user.password)

     if(isMatch){
      const token= jwt.sign({id:user._id},process.env.JWT_SECRET);
      res.json({success:true,token})
     }else{
        res.json({success:false,message:'Invalid Cradentials'})
     }

    } catch (err) {
       
        console.log(err);
        res.json({success:false,message:err.message}) 
    }
}

const getProfile= async (req,res)=>{
    try {
        
     const {userId}=req.body
     const userData= await userModel.findById(userId).select('-password');
     res.json({success:true,userData})

    } 
    catch (err) {
       console.log(err);
        res.json({success:false,message:err.message})  
    }
}

const updateProfile= async (req,res)=>{
    try {
        
     const {userId,name,phone,address,dob,gender}=req.body
     const imageFile=req.file 
       
     if(!name || !phone || !dob || !gender){
        return res.json({success:false,message:"missing detail"});
     }
     
     await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),gender,dob});

     if(imageFile){
       const imageUpload=await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
       const imageUrl=imageUpload.secure_url;
       await userModel.findByIdAndUpdate(userId,{image:imageUrl})
     }
     res.json({success:true,message:'profile updated'})
    } 
    catch (err) {
       console.log(err);
        res.json({success:false,message:err.message})  
    }
}

const deleteProfile= async (req,res)=>{
    try {
        const {userId}=req.body;
        if(!userId){
            return res.json({success:false,message:'Not authorized'})
        }

        const user = await userModel.findById(userId);
        if(!user){
            return res.json({success:false,message:'User not found'})
        }

        await userModel.findByIdAndDelete(userId);
        await appointmentModel.deleteMany({userId});

        res.json({success:true,message:'Account deleted successfully'})
    } catch (err) {
        console.log(err);
        res.json({success:false,message:err.message})
    }
}

const bookAppointment=async(req,res)=>{
 try {
   const {userId,docId,slotDate,slotTime}=req.body;
   const docData=await doctorModel.findById(docId).select('-password');

   if(!docData.available){
    return res.json({success:false,message:'doctor is not avialable'})
   }
 
   let slots_booked= docData.slots_booked;

   if(slots_booked[slotDate]){
    if(slots_booked[slotDate].includes(slotTime)){
        res.json({success:false,message:'slot  is not available'})
    }
    else{
        slots_booked[slotDate].push(slotTime)
    }
   }
   else{
    slots_booked[slotDate]=[]
    slots_booked[slotDate].push(slotTime);
   }

   const userData=await userModel.findById(userId).select('-password');

   delete docData.slots_booked

   const appointmentData={
    userId,
    docId,
    userData,
    docData,
    amount:docData.fees,
    slotTime,
    slotDate,
    date:Date.now(),
   }

   const  newAppointment=new appointmentModel(appointmentData);
   await newAppointment.save();

   await doctorModel.findByIdAndUpdate(docId,{slots_booked});

   res.json({success:true,message:'Appointment Booked'})

 } catch (err) {
     console.log(err);
        res.json({success:false,message:err.message})  
 }
}

const listAppointment=async(req,res)=>{
    try {
        const {userId}=req.body;

        const appointments=await appointmentModel.find({userId});
         res.json({success:true,appointments})
    } catch (error) {
          console.log(err);
        res.json({success:false,message:err.message})   
    }
}

const cancelAppointment=async(req,res)=>{
    try {

        const {userId,appointmentId}=req.body;

        const appointmentData=await appointmentModel.findById(appointmentId);
         
        if(appointmentData.userId !== userId){
            return res.json({success:false,message:'unauthorized action'});
        }

        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true});

        const {docId,slotDate,slotTime}=appointmentData;

        const docData=await doctorModel.findById(docId);

        let slots_booked=docData.slots_booked;

        slots_booked[slotDate]=slots_booked[slotDate].filter(e=> e !==slotTime);

        await doctorModel.findByIdAndUpdate(docId,{slots_booked})

        res.json({success:true,message:'Appointment cancelled'})
        
    } catch (err) {
          console.log(err);
        res.json({success:false,message:err.message})  
    }
}

const razorpayInstance=new razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
})

const paymentRazorpay=async(req,res)=>{
try {

const {appointmentId}=req.body;
const appointmentData=await appointmentModel.findById(appointmentId);

if(!appointmentData || appointmentData.cancelled){
    return res.json({success:false,message:'Appointment is cancelled or not found'})
}
   
const option={
    amount:appointmentData.amount,
    currency:process.env.CURRENCY,
    receipt:appointmentId
}

const order=await razorpayInstance.orders.create(option);

res.json({success:true,order})

} 
catch (err) {
       console.log(err);
        res.json({success:false,message:err.message})  
}
}

const varifyRazorpay=async (req,res)=>{
    try {

        const {razorpay_order_id}=req.body;
        const orderInfo= await razorpayInstance.orders.fetch(razorpay_order_id);
        console.log(orderInfo)

        if(orderInfo.status === 'paid'){
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true});
            res.json({success:true,message:"payment successful"})
        }
        else{
            res.json({success:false,message:'payment failed'})
        }
        
    } catch (err) {
            console.log(err);
        res.json({success:false,message:err.message})  
    }
}

export {registerUser,loginUser,getProfile,updateProfile,bookAppointment,listAppointment,cancelAppointment,paymentRazorpay,varifyRazorpay,deleteProfile}