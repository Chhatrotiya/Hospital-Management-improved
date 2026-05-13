import express  from 'express'
import { bookAppointment, cancelAppointment, deleteProfile, getProfile, listAppointment, loginUser, paymentRazorpay, registerUser, updateProfile, varifyRazorpay } from '../controllers/userController.js';
import { createUserChat, listUserChats, getUserChatById } from '../controllers/chatController.js';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js'

const userRouter=express.Router();

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/get-profile',authUser,getProfile)
userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile);
userRouter.post('/book-appointment',authUser,bookAppointment);
userRouter.get('/appointments',authUser,listAppointment)
userRouter.post('/cancel-appointment',authUser,cancelAppointment)
userRouter.delete('/delete-profile',authUser,deleteProfile)
userRouter.post('/payment-razorpay',authUser,paymentRazorpay)
userRouter.post('/varifyRazorpay',authUser,varifyRazorpay)

userRouter.post('/chat',authUser,createUserChat)
userRouter.get('/chats',authUser,listUserChats)
userRouter.get('/chat/:chatId',authUser,getUserChatById)

export default userRouter