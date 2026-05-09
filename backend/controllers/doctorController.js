import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js";


const changeAvailability=async(req,res)=>{
    try {
        const {docId}=req.body;
        const doctor= await doctorModel.findById(docId);
        await doctorModel.findByIdAndUpdate(docId,{available:!doctor.available})
             res.json({success:true,message:"availability changed"})
    } catch (err) {
           console.log(err);
     res.json({success:false,message:err.message})
    }
}

const doctorsList=async(req,res)=>{
    try {
        
        const doctors=await doctorModel.find({}).select(['-password','-email']);
        res.json({success:true,doctors})

    } catch (error) {
             console.log(err);
     res.json({success:false,message:err.message}) 
    }
}

const loginDoctor=async (req,res)=>{
    try {
        const {email,password}=req.body;

        const doctor=await doctorModel.findOne({email})
         
        if(!doctor){
            return res.json({success:true,message:'Invalid cradential'});
        }

        const isMatch=await bcrypt.compare(password,doctor.password);

      if(isMatch){
        const token =jwt.sign({id:doctor._id},process.env.JWT_SECRET);
        res.json({success:true,token})
      }
      else{
            return res.json({success:true,message:'Invalid cradential'});
          }

    } catch (err) {
               console.log(err);
     res.json({success:false,message:err.message}) 
    }
}

const appointmentDoctor= async (req,res)=>{
    try {

        const {docId}=req.body;
        const appointments=await  appointmentModel.find({docId});

        res.json({success:true,appointments});
        
    } catch (err) {
                    console.log(err);
     res.json({success:false,message:err.message})  
    }
}

const appointmentCompleted=async(req,res)=>{
    try {
        
       const {docId,appointmentId}=req.body;

       const appointmentData=await appointmentModel.findById(appointmentId);

       if(appointmentData && appointmentData.docId === docId){
        await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true});
       return  res.json({success:true,message:'Appointment completed'});
       }
       else{
        return res.json({success:false,message:'mark failed'})
       }

    } catch (err) {
      console.log(err);
     res.json({success:false,message:err.message})  
    }
}

const appointmentCancelled=async(req,res)=>{
    try {
        
       const {docId,appointmentId}=req.body;

       const appointmentData=await appointmentModel.findById(appointmentId);

       if(appointmentData && appointmentData.docId  ===  docId){
        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true});
        res.json({success:true,message:'Appointment Cancelled'});
       }
       else{
        return res.json({success:false,message:'mark failed'})
       }

    } catch (err) {
      console.log(err);
     res.json({success:false,message:err.message})  
    }
}

const doctorDashboard= async(req,res)=>{
    try {
        
        const {docId}=req.body;

        const appointments=await appointmentModel.find({docId});

        let earnings=0;

        appointments.map((item)=>{
            if(item.isCompleted || item.payment){
                earnings+=item.amount;
            }
        })

        let patients=[]

        appointments.map((item)=>{
            if(!patients.includes(item.userId)){
                patients.push(item.userId);
            }
        })

        const dashData={
            earnings,
            appointments:appointments.length,
            patients:patients.length,
            latestAppointments:appointments.reverse().slice(0,5)
        }

        res.json({success:true,dashData})

    } catch (err) {
          console.log(err);
     res.json({success:false,message:err.message}) 
    }
}

const doctorProfile=async(req,res)=>{
    try {
        
     const {docId}=req.body;
     const profileData=await doctorModel.findById(docId).select('-password');
      
     res.json({success:true,profileData})

    } catch (err) {
         console.log(err);
     res.json({success:false,message:err.message})  
    }
}

const updateDoctorProfile=async (req,res)=>{
    try {
        
   const {docId,fees,available,address}=req.body;

   await doctorModel.findByIdAndUpdate(docId,{fees,available,address});

   res.json({success:true,message:'Profile Updated'});

    } catch (err) {
          console.log(err);
     res.json({success:false,message:err.message})  
    }
}

export {changeAvailability,
    doctorsList,
    loginDoctor,appointmentDoctor,
    appointmentCompleted,
    appointmentCancelled,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile
}