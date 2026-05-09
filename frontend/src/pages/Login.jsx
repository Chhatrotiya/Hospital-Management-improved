import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { Appcontext } from '../context/AppContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const {token,setToken,backendUrl}=useContext(Appcontext)
   const navigate=useNavigate()
  const [state,setState]=useState("Sign Up");
  const[email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [name,setName]=useState('');

  const handleSubmit=async(e)=>{
   e.preventDefault();
      try {
        if(state === 'Sign Up'){
          const {data}=await axios.post(backendUrl + '/api/user/register',{name,password,email})
          if(data.success){
            setToken(data.token);
            localStorage.setItem('token',data.token)
          }
          else{
            toast.error(data.message)
          }
        }
        else{
        const {data}=await axios.post(backendUrl + '/api/user/login',{password,email})
          if(data.success){
            setToken(data.token);
            localStorage.setItem('token',data.token)
          }
          else{
            toast.error(data.message)
          }
        }
      } catch (err) {
        console.log(err);
        toast.error(err.message)
        
      }

        }

        useEffect(()=>{
          if(token){
            navigate('/')
          }
        },[token])

  return (
   <form onSubmit={handleSubmit} className='flex min-h-[80vh] items-center bg-transparent'>
    <div className='flex flex-col gap-6 m-auto items-start p-8 sm:min-w-96 border border-stone-200 rounded-lg text-stone-600 text-sm shadow-md bg-white'>
      <div className='text-center w-full'>
        <h1 className='text-3xl font-bold text-stone-900 mb-2'>
          {state==="Sign Up"? "Create Account":"Welcome Back"}
        </h1>
        <p className='text-stone-500'>Please {state==="Sign Up"? "sign up":"login"} to book your appointment</p>
      </div>

        {
          state=== "Sign Up" &&  <div className='w-full'>
            <label className='block text-stone-900 font-medium mb-2'>Full Name</label>
            <input className='border border-stone-300 w-full p-3 rounded-lg bg-stone-50 text-stone-900 placeholder-stone-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm' type="text" onChange={(e)=>setName(e.target.value)} value={name} placeholder="Enter your full name" required/>
          </div>
        }

         <div className='w-full'>
          <label className='block text-stone-900 font-medium mb-2'>Email</label>
          <input className='border border-stone-300 w-full p-3 rounded-lg bg-stone-50 text-stone-900 placeholder-stone-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm' type="email" onChange={(e)=>setEmail(e.target.value)} value={email} placeholder="Enter your email" required />
        </div>

         <div className='w-full'>
          <label className='block text-stone-900 font-medium mb-2'>Password</label>
          <input className='border border-stone-300 w-full p-3 rounded-lg bg-stone-50 text-stone-900 placeholder-stone-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm' type="password" onChange={(e)=>setPassword(e.target.value)} value={password} placeholder="Enter your password" required/>
        </div>

      <button type='submit' className='w-full bg-stone-900 hover:bg-stone-800 py-3 text-white text-base rounded-lg font-medium transition-colors'>
        {state==="Sign Up"? "Create Account":"Login"}
      </button>

      <div className='w-full text-center'>
        {
          state==="Sign Up"?
          <p className='text-stone-500'>
            Already have an account? <span className='text-primary hover:text-teal-700 font-medium underline cursor-pointer transition-colors' onClick={()=>setState("login")}>Login here</span>
          </p>:
          <p className='text-stone-500'>
            Create a new account? <span className='text-primary hover:text-teal-700 font-medium underline cursor-pointer transition-colors' onClick={()=>setState("Sign Up")}>Click here!</span>
          </p>
        }
      </div>
    </div>
   </form>
  )
}

export default Login