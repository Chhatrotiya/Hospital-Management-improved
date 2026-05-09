import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddDoctor = () => {

  const[docImg,setDocImg]=useState(false);
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [experience,setExperience]=useState('1 year');
  const [fees,setFees]=useState('');
  const [about,setAbout]=useState('')
  const [speciality,setSpeciality]=useState('General physician');
  const [degree,setDegree]=useState('');
  const [address1,setAddress1]=useState('');
  const [address2,setAddress2]=useState('');

   const {atoken,backendUrl}=useContext(AdminContext)

  const onSubmitHandler= async (e)=>{
    e.preventDefault();
    try {
      if(!docImg){
        return toast.error('Image not Selected');
      }
      const formData=new FormData();

      formData.append('image',docImg);
      formData.append('name',name);
      formData.append('email',email);
      formData.append('password',password);
      formData.append('experience',experience);
      formData.append('fees',Number(fees));
      formData.append('about',about);
      formData.append('speciality',speciality);
      formData.append('degree',degree);
      formData.append('address',JSON.stringify({lin1:address1,line2:address2}));

      formData.forEach((l,k)=>{
        console.log(`${k}=> ${l}`)
      })

      const {data}= await axios.post(backendUrl + '/api/admin/add-doctor',formData,{headers:{atoken}})

      if(data.success){
        toast.success(data.message);
        setDocImg(false);
        setName('');
        setEmail('');
        setAbout('');
        setPassword('');
        setFees('');
        setDegree('');
        setAddress1('');
        setAddress2('');
      }else{
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }

  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-screen flex items-center justify-center bg-stone-100 p-5'>
      <div className='w-full max-w-4xl'>
      <p className='mb-6 text-2xl font-bold text-center text-black'>
        Add Doctor
      </p>
      <div className='bg-white px-8 py-8 rounded-2xl border border-stone-200 w-full max-h-[80vh] overflow-y-scroll shadow-lg'>
        <div className='flex items-center gap-4 mb-8 text-stone-600'>
          <label htmlFor="doc-img">
             <img  className='bg-stone-100 w-16 h-16 rounded-full cursor-pointer object-cover border-2 border-stone-200' src={docImg  ? URL.createObjectURL(docImg) :assets.upload_area} alt="" />
          </label>
          <input onChange={(e)=>setDocImg(e.target.files[0])} type="file"  name='image' id="doc-img" hidden />
          <p className='text-stone-600'>Upload Doctor <br /> image</p>
        </div>

        <div className='flex flex-col lg:flex-row items-start text-stone-600 gap-10'>
          {/* left and right column split */}

          <div className='gap-4 flex flex-col lg:flex-1 w-full'>
            <div className='flex flex-1 flex-col gap-1'>
               <p className='text-stone-600'>Doctor Name</p>
               <input onChange={(e)=>setName(e.target.value)} value={name} className='border border-stone-300 bg-stone-50 text-stone-800 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20' type="text" placeholder='Name' required />
            </div>

            <div className='flex flex-1 flex-col gap-1'>
               <p className='text-stone-600'>Doctor Email</p>
               <input onChange={(e)=>setEmail(e.target.value)} value={email} className='border border-stone-300 bg-stone-50 text-stone-800 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20' type="Email" placeholder='Email' required />
            </div>

            <div className='flex flex-1 flex-col gap-1'>
               <p className='text-stone-600'>Doctor Password</p>
               <input onChange={(e)=>setPassword(e.target.value)} value={password} className='border border-stone-300 bg-stone-50 text-stone-800 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20' type="Password" placeholder='password' required />
            </div>

            <div className='flex flex-1 flex-col gap-1'>
               <p className='text-stone-600'>Experience</p>
               <select onChange={(e)=>setExperience(e.target.value)} value={experience} className='border border-stone-300 bg-stone-50 text-stone-800 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20' >
                <option value="1 year">1 year</option>
                <option value="2 year">2year</option>
                <option value="3 year">3 year</option>
                <option value="4 year">4 year</option>
                <option value="5 year">5 year</option>
                <option value="6 year">6 year</option>
                <option value="7 year">7 year</option>
                <option value="8 year">8 year</option>
                <option value="9 year">9 year</option>
                <option value="10 year">10 year</option>
               </select>
            </div>

            <div className='flex flex-1 flex-col gap-1'>
               <p className='text-stone-600'>Fees</p>
               <input onChange={(e)=>setFees(e.target.value)} value={fees} className='border border-stone-300 bg-stone-50 text-stone-800 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20' type="number" placeholder='Fees' required />
            </div>

          </div>

          <div className='gap-4 flex flex-col lg:flex-1 w-full'>

            <div className='flex flex-1 flex-col gap-1'>
              <p className='text-stone-600'>Speciality</p>
              <select onChange={(e)=>setSpeciality(e.target.value)} value={speciality} className='border border-stone-300 bg-stone-50 text-stone-800 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20' >
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div className='flex flex-1 flex-col gap-1' >
               <p className='text-stone-600'>Education</p>
               <input onChange={(e)=>setDegree(e.target.value)} value={degree} className='border border-stone-300 bg-stone-50 text-stone-800 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20' type="text" placeholder='Education' required />
            </div>

              <div className='flex flex-1 flex-col gap-1'>
               <p className='text-stone-600'>Address</p>
               <input onChange={(e)=>setAddress1(e.target.value)} value={address1} className='border border-stone-300 bg-stone-50 text-stone-800 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20' type="text" placeholder='Address1' required />
               <input onChange={(e)=>setAddress2(e.target.value)} value={address2} className='border border-stone-300 bg-stone-50 text-stone-800 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20' type="text" placeholder='Address2' required />
            </div>

          </div>
        </div>
        <hr className='border-stone-200 my-6' />
        <div className='flex flex-1 flex-col gap-1'>
          <p className='mt-4 mb-2 text-stone-600'>About</p>
          <textarea onChange={(e)=>setAbout(e.target.value)} value={about} className='border border-stone-300 bg-stone-50 text-stone-800 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20' placeholder='Write about Doctor' rows={5} required />
        </div>
        <button type='submit' className='bg-black hover:bg-gray-900 px-10 py-3 mt-4 text-white rounded-full transition-all duration-300 self-center'>Add Doctor</button>
      </div>
    </div>
    </form>
  )
}

export default AddDoctor