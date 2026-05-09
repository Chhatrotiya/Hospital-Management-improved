import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import {useNavigate} from'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'

const Navbar = () => {
    const {atoken,setAtoken}=useContext(AdminContext)
    const navigate=useNavigate()
    const{dtoken,setDtoken}=useContext(DoctorContext)

   const logout=()=>{
    navigate('/')
    atoken && setAtoken('')
    atoken && localStorage.removeItem('atoken')
     dtoken && setDtoken('')
    dtoken && localStorage.removeItem('dtoken')
   }

  return (
    <div className='flex justify-between items-center py-3 px-4 sm:px-10 border-b border-stone-200 bg-white text-stone-800 shadow-md z-20'>
        <div className='flex items-center gap-2 text-xs'>
            <h1 onClick={()=>navigate('/')} className='text-primary cursor-pointer text-xl font-bold'>mediVerse</h1>
            <p className='bg-stone-100 px-2.5 py-0.5 rounded-full text-stone-600 text-xs border border-stone-200'>{atoken ? "Admin":"Doctor"}</p>
        </div> 
        <button onClick={logout} className='bg-black hover:bg-gray-900 text-white text-sm px-8 py-2 rounded-full transition-colors shadow-lg'>Logout</button>
    </div>
  )
}

export default Navbar