import { createContext, useEffect, useState } from "react";
import { io } from 'socket.io-client'
// import { doctors } from "../assets/assets";
import axios from 'axios'
import { toast } from "react-toastify";

export const Appcontext=createContext()

const AppContextProvider=(props)=>{
   const currencySymbol='$';
    const [doctors,setDoctors]=useState([]);
    const [token,setToken]=useState(localStorage.getItem('token')?localStorage.getItem('token'):'');
    const [userData,setUserData]=useState(false);
    const [unreadChatCount,setUnreadChatCount]=useState(0);
    const [socket,setSocket]=useState(null);

 const backendUrl=import.meta.env.VITE_BACKEND_URL;
   
 const getAllDoctors=async()=>{
        try {
        const  {data}= await axios.get(backendUrl + '/api/doctor/list');

        if(data.success){
            setDoctors(data.doctors);
            console.log(data.doctors); 
        }else{
            toast.error(data.message);
        }  
        } 
        catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const handleUserDeleted = () => {
        localStorage.removeItem('token');
        setToken('');
        setUserData(false);
        toast.info('Your account has been deleted. Please sign up again.');
        window.location.href = '/login';
    }

    const loadProfileData=async()=>{
        try {
            const {data}=await axios.get(backendUrl +'/api/user/get-profile',{headers:{token}})
            if(data.success){
                setUserData(data.userData);
            }
            else{
                if(data.message && (data.message.includes('not found') || data.message.includes('User not found'))){
                    handleUserDeleted();
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            console.log(error);
            if(error.response?.status === 404 || error.response?.status === 401){
                handleUserDeleted();
            } else {
                toast.error(error.message);
            }
        }
    }

    const loadChatCount=async()=>{
        try {
            const { data } = await axios.get(backendUrl + '/api/user/chats', { headers: { token } })
            if (data.success) {
                const count = data.chats.reduce((total, chat) => total + (chat.unreadCount || 0), 0)
                setUnreadChatCount(count)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const value={
        doctors,getAllDoctors,
        currencySymbol,
        token,setToken,
        backendUrl,
        userData,setUserData,
        loadProfileData,
        unreadChatCount,
        loadChatCount,
        socket
    }

    useEffect(()=>{
        getAllDoctors();
    },[])

    useEffect(()=>{
       if(token){
        loadProfileData()
        loadChatCount()
       }else{
        setUserData(false);
        setUnreadChatCount(0);
       }
    },[token])

    useEffect(() => {
      if (!token) {
        if (socket) {
          socket.disconnect()
          setSocket(null)
        }
        return
      }

      const socketClient = io(backendUrl, { auth: { token } })
      setSocket(socketClient)

      socketClient.on('connect', () => {
        socketClient.emit('joinUser')
      })

      socketClient.on('newMessage', () => {
        loadChatCount()
      })

      socketClient.on('messageStatusUpdate', () => {
        loadChatCount()
      })

      socketClient.on('connect_error', (err) => {
        console.log('Socket connect error:', err?.message || err)
      })

      socketClient.on('error', (err) => {
        console.log('Socket error:', err)
      })

      return () => {
        socketClient.disconnect()
        setSocket(null)
      }
    }, [backendUrl, token])
    return (
        <Appcontext.Provider value={value}>
            {props.children}
        </Appcontext.Provider>
    )
}
export default AppContextProvider;
