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
    const [patients,setPatients]=useState([])

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

    const getAllPatients=async()=>{
      try {
        const {data} = await axios.get(backendUrl + '/api/admin/patients',{headers:{atoken}})
        if(data.success){
          setPatients(data.patients)
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message)
      }
    }

    const deletePatient=async(patientId)=>{
      try {
        const confirmed = window.confirm('Delete this patient and all related appointments?')
        if(!confirmed) return;

        const {data}= await axios.delete(backendUrl + `/api/admin/patient/${patientId}`,{headers:{atoken}})
        if(data.success){
          toast.success(data.message)
          getAllPatients()
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message)
      }
    }

    const updatePatient=async(patientId,patientData)=>{
      try {
        const {data} = await axios.patch(backendUrl + `/api/admin/patient/${patientId}`,{
          ...patientData,
          address: JSON.stringify(patientData.address)
        },{headers:{atoken}})
        if(data.success){
          toast.success(data.message)
          getAllPatients()
          return true
        } else {
          toast.error(data.message)
          return false
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message)
        return false
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
patients,getAllPatients,deletePatient,updatePatient,
dashData,getDashData

}
return(
    <AdminContext.Provider value={value}>
        {props.children}
    </AdminContext.Provider>
)
}
export default  AdminContextProvider