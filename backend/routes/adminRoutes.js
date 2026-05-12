import express from 'express'
import { addDoctor, adminDashboard, allDoctor, appointmentAdmin, appointmentCancel, loginAdmin, allPatients, updatePatient, deletePatient, deleteDoctor } from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js';
import { changeAvailability } from '../controllers/doctorController.js';

const adminRouter=express.Router();

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)
adminRouter.post('/login',loginAdmin)
adminRouter.post('/all-doctors',authAdmin,allDoctor)
adminRouter.post('/change-availability',authAdmin,changeAvailability)
adminRouter.get('/appointments',authAdmin,appointmentAdmin);
adminRouter.post('/cancel-appointment',authAdmin,appointmentCancel)
adminRouter.get('/dashboard',authAdmin,adminDashboard);
adminRouter.get('/patients',authAdmin,allPatients);
adminRouter.patch('/patient/:id',authAdmin,updatePatient);
adminRouter.delete('/patient/:id',authAdmin,deletePatient);
adminRouter.delete('/doctor/:id',authAdmin,deleteDoctor);

export default adminRouter

