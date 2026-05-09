import express from 'express'
import { appointmentCancelled, appointmentCompleted, appointmentDoctor, doctorDashboard, doctorProfile, doctorsList, loginDoctor, updateDoctorProfile } from '../controllers/doctorController.js';
import authDoctor from '../middlewares/authDoctor.js';

const doctorRouter=express.Router();

doctorRouter.get('/list',doctorsList);
doctorRouter.post('/login',loginDoctor);
doctorRouter.get('/appointments',authDoctor,appointmentDoctor)
doctorRouter.post('/complete-appointment',authDoctor,appointmentCompleted)
doctorRouter.post('/cancel-appointment',authDoctor,appointmentCancelled)
doctorRouter.get('/dashboard',authDoctor,doctorDashboard)
doctorRouter.get('/profile',authDoctor,doctorProfile);
doctorRouter.post('/update-profile',authDoctor,updateDoctorProfile)

export default doctorRouter