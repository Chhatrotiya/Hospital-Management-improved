import axios from "axios";
import { useState, useEffect } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";
import { io } from 'socket.io-client'

export const DoctorContext=createContext()
const  DoctorContextProvider=(props)=>{

    const backendUrl=import.meta.env.VITE_BACKEND_URL
    const [dtoken,setDtoken]=useState(localStorage.getItem('dtoken')?localStorage.getItem('dtoken'):'');
    const [appointments,setAppointments]=useState([]);
    const [dashData,setDashData]=useState(false);
    const [profileData,setProfileData]=useState(false);
    const [unreadChatCount,setUnreadChatCount]=useState(0);
    const [socket, setSocket] = useState(null);

    const getAppointments= async(req,res)=>{
        try {
            const {data}=await axios.get(backendUrl +'/api/doctor/appointments',{headers:{dtoken}})
            if(data.success){
                setAppointments(data.appointments.reverse());
                console.log(data.appointments.reverse());
                
            }
        } catch (err) {
            toast.error(err.message)
        }
    }

    const completeAppointment=async(appointmentId)=>{
        try {
            const {data}=await axios.post(backendUrl +'/api/doctor/complete-appointment',{appointmentId},{headers:{dtoken}})
            if(data.success){
                toast.success(data.message);
                getAppointments()
            }
        } catch (err) {
            toast.error(err.message)
        }
    }

        const cancelAppointment=async(appointmentId)=>{
        try {
            const {data}=await axios.post(backendUrl +'/api/doctor/cancel-appointment',{appointmentId},{headers:{dtoken}})
            if(data.success){
                toast.success(data.message);
                getAppointments()
            }
        } catch (err) {
            toast.error(err.message)
        }
    }

    const loadChatCount=async()=>{
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/chats', { headers: { dtoken } })
            if (data.success) {
                const count = data.chats.reduce((total, chat) => total + (chat.unreadCount || 0), 0)
                setUnreadChatCount(count)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const getDashData=async()=>{
        try {
            const {data}=await axios.get(backendUrl + '/api/doctor/dashboard',{headers:{dtoken}});
            if(data.success){
                setDashData(data.dashData);
                console.log(data.dashData);
                
            }
            else{
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.message) 
        }
    }
     const getProfileData=async()=>{
        try {
          
            const {data}=await axios.get(backendUrl + '/api/doctor/profile',{headers:{dtoken}});
            if(data.success){
                setProfileData(data.profileData);
                console.log(data.profileData)
            }

        } catch (error) {
            toast.error(err.message) 
        }
     }

useEffect(() => {
  if (dtoken) {
    loadChatCount()
  } else {
    setUnreadChatCount(0)
  }
}, [dtoken])

useEffect(() => {
  if (!dtoken) {
    if (socket) {
      socket.disconnect()
      setSocket(null)
    }
    return
  }

  const socketClient = io(backendUrl, { auth: { token: dtoken } })
  setSocket(socketClient)

  socketClient.on('connect', () => {
    socketClient.emit('joinUser', { role: 'doctor' })
  })

  socketClient.on('newMessage', () => {
    loadChatCount()
  })

  socketClient.on('messageStatusUpdate', () => {
    loadChatCount()
  })

  socketClient.on('connect_error', (err) => {
    console.log('Doctor socket connect error:', err?.message || err)
  })

  socketClient.on('error', (err) => {
    console.log('Doctor socket error:', err)
  })

  return () => {
    socketClient.disconnect()
    setSocket(null)
  }
}, [backendUrl, dtoken])

const value={
backendUrl,
dtoken,setDtoken,
getAppointments,appointments,
completeAppointment,cancelAppointment,
dashData,setDashData,getDashData,
profileData,setProfileData,getProfileData,
unreadChatCount,loadChatCount,
socket
}
return(
    <DoctorContext.Provider value={value}>
        {props.children}
    </DoctorContext.Provider>
)
}
export default  DoctorContextProvider
