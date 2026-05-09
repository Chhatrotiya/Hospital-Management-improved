import { createContext, useEffect, useState } from "react";
// import { doctors } from "../assets/assets";
import axios from 'axios'
import { toast } from "react-toastify";

export const Appcontext=createContext()

const AppContextProvider=(props)=>{
   const currencySymbol='$';
    const [doctors,setDoctors]=useState([]);
    const [token,setToken]=useState(localStorage.getItem('token')?localStorage.getItem('token'):'');
    const [userData,setUserData]=useState(false);

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

    const loadProfileData=async()=>{
        try {
            const {data}=await axios.get(backendUrl +'/api/user/get-profile',{headers:{token}})
            if(data.success){
                setUserData(data.userData);
            }
            else{
                toast.error(data.message);
            }
        } catch (error) {
                 console.log(error);
            toast.error(error.message);
        }
    }

    const value={
        doctors,getAllDoctors,
        currencySymbol,
        token,setToken,
        backendUrl,
        userData,setUserData,
        loadProfileData
    }

    useEffect(()=>{
        getAllDoctors();
    },[])

    useEffect(()=>{
       if(token){
        loadProfileData()
       }else{
        setUserData(false);
       }
    },[token])
    return (
        <Appcontext.Provider value={value}>
            {props.children}
        </Appcontext.Provider>
    )
}
export default AppContextProvider;