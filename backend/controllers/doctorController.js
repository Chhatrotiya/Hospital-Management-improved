import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";


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

const doctorPatientsList = async (req, res) => {
    try {
        const { docId } = req.body
        const users = await userModel.find({}).select(['-password'])
        const appointments = await appointmentModel.find({ docId }).sort({ date: -1 })
        const latestByUser = new Map()

        appointments.forEach((appointment) => {
            const key = String(appointment.userId)
            if (!latestByUser.has(key)) {
                latestByUser.set(key, {
                    lastAppointmentId: appointment._id,
                    lastAppointmentDate: appointment.date || 0,
                    lastSlotDate: appointment.slotDate,
                    lastSlotTime: appointment.slotTime,
                    lastStatus: appointment.cancelled ? 'Cancelled' : appointment.isCompleted ? 'Completed' : 'Upcoming'
                })
            }
        })

        const patients = users.map((user) => {
            const appointment = latestByUser.get(String(user._id)) || {}
            return {
                userId: user._id,
                name: user.name,
                image: user.image || '',
                lastAppointmentId: appointment.lastAppointmentId || '',
                lastSlotDate: appointment.lastSlotDate || '',
                lastSlotTime: appointment.lastSlotTime || '',
                lastStatus: appointment.lastStatus || 'No Appointments',
                lastAppointmentDate: appointment.lastAppointmentDate || 0
            }
        })

        const sortedPatients = patients
            .filter((patient) => patient.lastAppointmentId)
            .sort((a, b) => b.lastAppointmentDate - a.lastAppointmentDate)
            .concat(
                patients.filter((patient) => !patient.lastAppointmentId)
            )

        res.json({ success: true, patients: sortedPatients })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {changeAvailability,
    doctorsList,
    loginDoctor,appointmentDoctor,
    appointmentCompleted,
    appointmentCancelled,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile,
    doctorPatientsList
}