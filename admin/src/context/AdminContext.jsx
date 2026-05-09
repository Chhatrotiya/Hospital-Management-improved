import axios from "axios";
import { useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";

export const AdminContext=createContext()

const AdminContextProvider=(props)=>{
    const [atoken,setAtoken]=useState(localStorage.getItem('atoken')?localStorage.getItem('atoken'):'')

    const backendUrl=import.meta.env.VITE_BACKEND_URL;
    const [doctors,setDoctors]=useState([])
    const [appointments,setAppointments]=useState([]);
    const [dashData,setDashData]=useState(false)

    const getAllDoctors=async()=>{
        try {
        const  {data}= await axios.post(backendUrl + '/api/admin/all-doctors',{},{headers:{atoken}});

        if(data.success){
            setDoctors(data.doctors);
            console.log(data.doctors); 
        }else{
            toast.error(data.message);
        }  
        } 
        catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

   const changeAvailability=async(docId)=>{
    try {
       const  {data}= await axios.post(backendUrl + '/api/admin/change-availability',{docId},{headers:{atoken}}); 
       if(data.success){
        toast.success(data.message)
        getAllDoctors();
       }
       else{
        toast.error(data.message);
       }
    } 
    catch (error) {
           console.log(error);
            toast.error(error.message) 
    }
   }

 const  getAllAppointments=async()=>{
   try {

    const {data}=await axios.get(backendUrl + '/api/admin/appointments',{headers:{atoken}})
    if(data.success){
        console.log(data.appointments);
        setAppointments(data.appointments);
    }
    else{
        toast.error(data.message)
    }
    
   } catch (err) {
     toast.error(err.message);
   }
 }

 const cancelAppointment= async(appointmentId)=>{
    try {
       const  {data}= await axios.post(backendUrl + '/api/admin/cancel-appointment',{appointmentId},{headers:{atoken}}) 
       if (data.success) {
        toast.success(data.message);
        getAllAppointments()
       }
       else{
        toast.error(data.message)
       }
    } catch (err) {
         toast.error(err.message);
    }
 }

 const getDashData=async()=>{
    try {
      const {data}=await axios.get(backendUrl + '/api/admin/dashboard',{headers:{atoken}})  
      if(data.success){
        setDashData(data.dashData);
        console.log(data.dashData)
      }
      else{
        toast.error(data.message);
      }
    } catch (err) {
        toast.error(err.message)
    }
 }

const value={
atoken,setAtoken,backendUrl,
doctors,getAllDoctors,
changeAvailability,
appointments,setAppointments,
getAllAppointments,cancelAppointment,
dashData,getDashData

}
return(
    <AdminContext.Provider value={value}>
        {props.children}
    </AdminContext.Provider>
)
}
export default  AdminContextProvider