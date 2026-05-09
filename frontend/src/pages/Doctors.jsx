import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Appcontext } from '../context/AppContext';

const Doctors = () => {
  const {speciality}=useParams();
  const {doctors}=useContext(Appcontext);
  const [filterDoc,setFilterDoc]=useState([]);
  const navigate=useNavigate();
   const [showFilter,setShowFilter]=useState(false)
  const applyFilter=()=>{
    if(speciality){
      setFilterDoc(doctors.filter((doc)=>doc.speciality===speciality))
    }
    else{
      setFilterDoc(doctors);
    }
  }

  useEffect(()=>{
    applyFilter()
  },[doctors,speciality])
  return (
    <div className='bg-transparent min-h-screen py-8 px-4'>
      <div className='max-w-7xl mx-auto'>
        {/* Header Section */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl md:text-4xl font-bold text-stone-900 mb-2'>
            Find Your <span className='text-transparent bg-clip-text bg-gradient-to-r from-teal-800 to-teal-950'>Doctor</span>
          </h1>
          <p className='text-stone-600 text-lg'>Browse through our specialist doctors and book appointments</p>
        </div>

        <div className='flex flex-col mt-8 gap-8 items-start lg:flex-row'>
          {/* Filter Button for Mobile */}
          <button className={`py-2 px-4 border border-stone-200 rounded-lg lg:hidden transition-colors ${showFilter?'bg-stone-900 text-white border-stone-900':'bg-white text-stone-600 hover:bg-stone-50'}`} onClick={()=>setShowFilter(prev=>!prev)}>
            {showFilter ? 'Hide Filters' : 'Show Filters'}
          </button>

          {/* Filter Sidebar */}
          <div className={`flex flex-col text-sm gap-3 ${showFilter?'flex':'hidden lg:flex'} lg:w-64`}>
            <h3 className='text-stone-900 font-semibold text-lg mb-4'>Specialties</h3>
            <div className='space-y-2'>
              <p onClick={()=>speciality==='General physician'?navigate('/doctors'):navigate('/doctors/General physician')}
                 className={`pl-4 py-3 pr-4 border border-stone-200 rounded-lg transition-all cursor-pointer hover:border-primary hover:bg-teal-50 ${speciality==='General physician'? "text-primary bg-teal-50 border-primary":"text-stone-600 bg-white"}`}>
                General physician
              </p>
              <p onClick={()=>speciality==='Gynecologist'?navigate('/doctors'):navigate('/doctors/Gynecologist')}
                 className={`pl-4 py-3 pr-4 border border-stone-200 rounded-lg transition-all cursor-pointer hover:border-primary hover:bg-teal-50 ${speciality==='Gynecologist'? "text-primary bg-teal-50 border-primary":"text-stone-600 bg-white"}`}>
                Gynecologist
              </p>
              <p onClick={()=>speciality==='Dermatologist'?navigate('/doctors'):navigate('/doctors/Dermatologist')}
                 className={`pl-4 py-3 pr-4 border border-stone-200 rounded-lg transition-all cursor-pointer hover:border-primary hover:bg-teal-50 ${speciality==='Dermatologist'? "text-primary bg-teal-50 border-primary":"text-stone-600 bg-white"}`}>
                Dermatologist
              </p>
              <p onClick={()=>speciality==='Pediatricians'?navigate('/doctors'):navigate('/doctors/Pediatricians')}
                 className={`pl-4 py-3 pr-4 border border-stone-200 rounded-lg transition-all cursor-pointer hover:border-primary hover:bg-teal-50 ${speciality==='Pediatricians'? "text-primary bg-teal-50 border-primary":"text-stone-600 bg-white"}`}>
                Pediatricians
              </p>
              <p onClick={()=>speciality==='Neurologist'?navigate('/doctors'):navigate('/doctors/Neurologist')}
                 className={`pl-4 py-3 pr-4 border border-stone-200 rounded-lg transition-all cursor-pointer hover:border-primary hover:bg-teal-50 ${speciality==='Neurologist'? "text-primary bg-teal-50 border-primary":"text-stone-600 bg-white"}`}>
                Neurologist
              </p>
              <p onClick={()=>speciality==='Gastroenterologist'?navigate('/doctors'):navigate('/doctors/Gastroenterologist')}
                 className={`pl-4 py-3 pr-4 border border-stone-200 rounded-lg transition-all cursor-pointer hover:border-primary hover:bg-teal-50 ${speciality==='Gastroenterologist'? "text-primary bg-teal-50 border-primary":"text-stone-600 bg-white"}`}>
                Gastroenterologist
              </p>
            </div>
          </div>

          {/* Doctors Grid */}
          <div className='flex-1'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {
                filterDoc.map((item,index)=>(
                  <div onClick={()=>navigate(`/appointment/${item._id}`)}
                       className='bg-white border border-stone-200 rounded-lg overflow-hidden cursor-pointer hover:border-primary hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-300 group'
                       key={index}>
                    <div className='relative'>
                      <img className='w-full h-48 object-cover bg-stone-50' src={item.image} alt={item.name} />
                      <div className={`absolute top-3 right-3 flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium ${item.available? 'bg-teal-50 text-teal-600 border border-teal-200':'bg-red-50 text-red-500 border border-red-200'}`}>
                        <div className={`w-2 h-2 rounded-full ${item.available? 'bg-teal-500':'bg-red-500'}`}></div>
                        <span>{item.available? 'Available':'Unavailable'}</span>
                      </div>
                    </div>

                    <div className='p-4'>
                      <h3 className='text-stone-900 text-lg font-semibold mb-1 group-hover:text-primary transition-colors'>{item.name}</h3>
                      <p className='text-stone-600 text-sm mb-3'>{item.speciality}</p>
                      <div className='flex items-center justify-between'>
                        <span className='text-teal-600 text-sm font-medium'>Book Appointment</span>
                        <div className='w-6 h-6 bg-teal-50 rounded-full flex items-center justify-center group-hover:bg-teal-100 transition-colors'>
                          <span className='text-primary text-xs'>→</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>

            {/* No doctors found message */}
            {filterDoc.length === 0 && (
              <div className='col-span-full text-center py-12'>
                <div className='text-stone-500 text-lg'>No doctors found for this specialty</div>
                <button
                  onClick={()=>navigate('/doctors')}
                  className='mt-4 bg-stone-900 hover:bg-stone-800 text-white px-6 py-2 rounded-lg font-medium transition-colors'
                >
                  View All Doctors
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Doctors