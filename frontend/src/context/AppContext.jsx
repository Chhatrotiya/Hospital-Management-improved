import { createContext, useEffect, useRef, useState } from "react";
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
    const isLoggingOutRef=useRef(false);

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
        if(isLoggingOutRef.current) return;
        isLoggingOutRef.current=true;
        localStorage.removeItem('token');
        setToken('');
        setUserData(false);
        setUnreadChatCount(0);
        toast.info('Your account has been deleted. Please sign up again.');
        window.location.replace('/login');
    }

    const loadProfileData=async()=>{
        try {
            const {data}=await axios.get(backendUrl +'/api/user/get-profile',{headers:{token}})
            if(data.success){
                setUserData(data.userData);
            }
            else{
                if(data.accountDeleted || (data.message && (data.message.includes('not found') || data.message.includes('User not found')))){
                    handleUserDeleted();
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            console.log(error);
            if(error.response?.data?.accountDeleted || error.response?.status === 404 || error.response?.status === 401){
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
        isLoggingOutRef.current=false;
        loadProfileData()
        loadChatCount()
       }else{
        setUserData(false);
        setUnreadChatCount(0);
       }
    },[token])

    useEffect(()=>{
      const interceptor=axios.interceptors.response.use(
        (response)=>{
          if(response.data?.accountDeleted){
            handleUserDeleted();
          }
          return response;
        },
        (error)=>{
          if(error.response?.data?.accountDeleted){
            handleUserDeleted();
          }
          return Promise.reject(error);
        }
      )

      return ()=>axios.interceptors.response.eject(interceptor);
    },[])

    useEffect(()=>{
      if(!token) return;

      const intervalId=setInterval(loadProfileData, 10000);
      const handleFocus=()=>loadProfileData();
      window.addEventListener('focus', handleFocus);

      return ()=>{
        clearInterval(intervalId);
        window.removeEventListener('focus', handleFocus);
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
