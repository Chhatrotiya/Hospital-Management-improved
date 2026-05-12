import validator from 'validator'
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'


const addDoctor=async(req,res)=>{
    try{
    const{name,email,password,speciality,degree,experience,available,about,fees,address,date}=req.body;
    const imageFile=req.file;
    
    if(!name || !email || !password || !speciality || !degree || !experience  || !about || !fees || !address ){
        return res.json({sucess:false,message:"missing detail"})
    }
    
    if(validator.isEmail("email")){
        return res.json({success:false,message:"please enter valid email"})
    }

    if (password.length<8) {
         return res.json({success:false,message:"please enter strong password"})
    }
   
    const salt=await bcrypt.genSalt(5);
    const hashedPassword=await bcrypt.hash(password,salt);

    const  imageUpload= await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"});
    const imageUrl=imageUpload.secure_url;

    const docData={
        name,
        email,
        password:hashedPassword,
        image:imageUrl,
        speciality,
        degree,
        experience,
        available,
        about,
        fees,
        address:JSON.parse(address),
        date:Date.now()

    }

    const newDoc=new doctorModel(docData);
    await newDoc.save()
      res.json({success:true,message:"doctor is added"})
    }catch(err){
     console.log(err);
     res.json({success:false,message:err.message})
    }
}

const loginAdmin=async(req,res)=>{
try{
    const {email,password}=req.body
if(email===process.env.ADMIN_EMAIL &&  password===process.env.ADMIN_PASSWORD){
   const token=jwt.sign(password+email,process.env.JWT_SECRET)
   res.json({success:true,token})
}
else{
     res.json({success:false,message:'invalid cradential'})

}
}catch(err){
     console.log(err);
     res.json({success:false,message:err.message})
}
}

const allDoctor=async (req,res)=>{
    try {

        const doctors=await doctorModel.find({}).select('-password')
        res.json({success:true,doctors})
        
    } catch (err) {
          console.log(err);
     res.json({success:false,message:err.message})
    }
}

const appointmentAdmin=async(req,res)=>{
    try {
       
        const appointments=await appointmentModel.find({});
        res.json({success:true,appointments})
        
    } catch (err) {
       console.log(err);
     res.json({success:false,message:err.message}) 
    }
}

const appointmentCancel=async(req,res)=>{
    try {

        const {appointmentId}=req.body;

        const appointmentData=await appointmentModel.findById(appointmentId);
         

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

const adminDashboard=async(req,res)=>{
    try {

        const users=await userModel.find({});
        const doctors=await doctorModel.find({});
        const appointments=await appointmentModel.find({});

        const dashData={
            patients:users.length,
            doctors:doctors.length,
            appointments:appointments.length,
            latestAppointments:appointments.reverse().slice(0,5),
        }

        res.json({success:true,dashData});
        
    } catch (err) {
        console.log(err);
        res.json({success:false,message:err.message})  
    }
}

const allPatients = async (req, res) => {
    try {
        const patients = await userModel.find({}).select('-password');
        res.json({success:true,patients});
    } catch (err) {
        console.log(err);
        res.json({success:false,message:err.message});
    }
}

const updatePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, gender, dob, address } = req.body;

        if (!name || !email || !phone || !gender || !dob) {
            return res.json({success:false,message:'Missing required fields'});
        }

        const existingPatient = await userModel.findById(id);
        if (!existingPatient) {
            return res.json({success:false,message:'Patient not found'});
        }

        await userModel.findByIdAndUpdate(id, {
            name,
            email,
            phone,
            gender,
            dob,
            address: address ? JSON.parse(address) : existingPatient.address,
        });

        res.json({success:true,message:'Patient updated successfully'});
    } catch (err) {
        console.log(err);
        res.json({success:false,message:err.message});
    }
}

const deletePatient = async (req, res) => {
    try {
        const { id } = req.params;

        const existingPatient = await userModel.findById(id);
        if (!existingPatient) {
            return res.json({success:false,message:'Patient not found'});
        }

        await userModel.findByIdAndDelete(id);
        await appointmentModel.deleteMany({ userId: id });

        res.json({success:true,message:'Patient deleted successfully'});
    } catch (err) {
        console.log(err);
        res.json({success:false,message:err.message});
    }
}

const deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;

        const existingDoctor = await doctorModel.findById(id);
        if (!existingDoctor) {
            return res.json({success:false,message:'Doctor not found'});
        }

        await doctorModel.findByIdAndDelete(id);
        await appointmentModel.deleteMany({ docId: id });

        res.json({success:true,message:'Doctor deleted successfully'});
    } catch (err) {
        console.log(err);
        res.json({success:false,message:err.message});
    }
}

export {addDoctor,loginAdmin,allDoctor,appointmentAdmin,appointmentCancel,adminDashboard,allPatients,updatePatient,deletePatient,deleteDoctor}