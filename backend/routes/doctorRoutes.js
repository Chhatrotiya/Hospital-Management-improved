import express from 'express'
import { appointmentCancelled, appointmentCompleted, appointmentDoctor, doctorDashboard, doctorProfile, doctorsList, loginDoctor, updateDoctorProfile, doctorPatientsList } from '../controllers/doctorController.js';
import { createDoctorChat, listDoctorChats, getDoctorChatById } from '../controllers/chatController.js';
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

doctorRouter.post('/chat',authDoctor,createDoctorChat)
doctorRouter.get('/chats',authDoctor,listDoctorChats)
doctorRouter.get('/chat/:chatId',authDoctor,getDoctorChatById)
doctorRouter.get('/patients',authDoctor,doctorPatientsList)

export default doctorRouter