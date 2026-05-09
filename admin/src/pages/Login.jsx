import React from 'react'
import { useContext } from 'react';
import { useState } from 'react'
import { AdminContext } from '../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DoctorContext } from '../context/DoctorContext';

const Login = () => {
    const[state,setState]=useState("Admin");
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('')

    const {setAtoken,backendUrl}=useContext(AdminContext)
    const {setDtoken}=useContext(DoctorContext);

    const onSubmitHandler =async (e)=>{
       e.preventDefault();
       try {
        
        if(state==="Admin"){
           const {data}=await axios.post(backendUrl+'/api/admin/login',{email,password});
           if(data.success){
            localStorage.setItem('atoken',data.token)
             setAtoken(data.token)
             console.log(data.token)
           }
           else{
            toast.error(data.message)
           }
        }else{
            const {data}=await axios.post(backendUrl+'/api/doctor/login',{email,password});
           if(data.success){
            localStorage.setItem('dtoken',data.token)
             setDtoken(data.token)
             console.log(data.token)
           }
           else{
            toast.error(data.message)
           }
        }

       } catch (error) {
        toast.error(error.message);
       }
    }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-screen flex items-center justify-center bg-stone-100'>
        <div className='flex flex-col gap-4 p-8 sm:min-w-96 min-w-[340px] bg-white border border-stone-200 rounded-2xl shadow-2xl shadow-primary/10'>
            <p className='text-3xl font-bold text-center mb-2'><span className='text-black'>{state}</span> <span className='text-stone-800'>Login</span></p>
            <div className='w-full'>
                <p className='text-stone-600 font-medium mb-2'>Email</p>
                <input onChange={(e)=>setEmail(e.target.value)} value={email} className='border border-stone-300 bg-stone-50 text-stone-800 rounded-lg mt-1 w-full p-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all' type="email" placeholder='Enter your email' />
            </div>
            <div className='w-full'>
                <p className='text-stone-600 font-medium mb-2'>Password</p>
                <input onChange={(e)=>setPassword(e.target.value)} value={password} className='border border-stone-300 bg-stone-50 text-stone-800 rounded-lg mt-1 w-full p-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all' type="password" placeholder='Enter your password' />
            </div>
            <button className='bg-black hover:bg-gray-900 text-white rounded-lg w-full py-3 text-base font-semibold transition-all duration-300 mt-2'>Login</button>
            <div className='text-center text-stone-500 text-sm'>
                {
                    state==='Admin'?
                    <p>Doctor Login <span className='underline text-primary hover:text-teal-600 cursor-pointer font-medium transition-colors' onClick={()=>setState("Doctor")}>click here</span></p>:
                    <p>Admin Login <span className='underline text-primary hover:text-teal-600 cursor-pointer font-medium transition-colors' onClick={()=>setState("Admin")}>click here</span></p> 
                }
            </div>
        </div>
    </form>
  )
}

export default Login