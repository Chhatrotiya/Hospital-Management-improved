import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminContext } from '../../context/AdminContext'

const PatientsList = () => {
  const { atoken, patients, getAllPatients, deletePatient } = useContext(AdminContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (atoken) {
      getAllPatients()
    }
  }, [atoken])

  return (
    <div className='m-5 overflow-y-scroll max-h-[90vh] text-stone-800'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-black'>Patients</h1>
        <p className='text-stone-500 mt-1'>View, edit, and delete registered patients with admin authorization.</p>
      </div>

      <div className='bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden'>
        <div className='hidden md:grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr_1fr] gap-4 py-4 px-6 border-b border-stone-200 bg-stone-50'>
          <p className='text-stone-600 font-semibold'>#</p>
          <p className='text-stone-600 font-semibold'>Patient</p>
          <p className='text-stone-600 font-semibold'>Email</p>
          <p className='text-stone-600 font-semibold'>Phone</p>
          <p className='text-stone-600 font-semibold'>DOB</p>
          <p className='text-stone-600 font-semibold'>Actions</p>
        </div>

        {patients.length === 0 ? (
          <div className='p-6 text-stone-500'>No patients found.</div>
        ) : (
          patients.map((patient, index) => (
            <div key={patient._id} className='flex flex-col gap-4 px-6 py-4 border-b border-stone-100 hover:bg-stone-50 transition-all duration-200 md:grid md:grid-cols-[0.5fr_2fr_1fr_1fr_1fr_1fr] md:items-center'>
              <p className='font-medium text-stone-600 md:hidden'>#{index + 1}</p>
              <div className='flex flex-col'>
                <p className='font-semibold text-stone-800'>{patient.name}</p>
                <p className='text-sm text-stone-500 md:hidden'>{patient.email}</p>
              </div>
              <p className='hidden md:block text-stone-700'>{patient.name}</p>
              <p className='text-stone-700 break-all'>{patient.email}</p>
              <p className='text-stone-700'>{patient.phone}</p>
              <p className='text-stone-700'>{patient.dob || 'N/A'}</p>
              <div className='flex flex-wrap gap-2'>
                <button
                  onClick={() => navigate(`/patients/${patient._id}/edit`)}
                  className='px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition'
                >
                  Edit
                </button>
                <button
                  onClick={() => deletePatient(patient._id)}
                  className='px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition'
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  )
}

export default PatientsList
