import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../../context/DoctorContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const DoctorPatientList = () => {
  const { backendUrl, dtoken } = useContext(DoctorContext)
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const loadPatients = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/doctor/patients', { headers: { dtoken } })
      if (data.success) {
        setPatients(data.patients)
      } else {
        toast.error(data.message || 'Unable to load patients')
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message || 'Unable to load patients')
    } finally {
      setLoading(false)
    }
  }

  const startChat = async (patient) => {
    try {
      const payload = patient.lastAppointmentId
        ? { appointmentId: patient.lastAppointmentId }
        : { userId: patient.userId }

      const { data } = await axios.post(backendUrl + '/api/doctor/chat', payload, { headers: { dtoken } })
      if (data.success) {
        navigate(`/doctor-chat/${data.chat._id}`)
      } else {
        toast.error(data.message || 'Unable to open chat')
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message || 'Unable to open chat')
    }
  }

  useEffect(() => {
    if (dtoken) loadPatients()
  }, [dtoken])

  const filteredPatients = patients.filter((patient) =>
    patient.name?.toLowerCase().includes(searchQuery.trim().toLowerCase())
  )

  return (
    <div className='max-w-6xl w-full m-5 text-stone-800'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-black'>Patients</h1>
        <p className='text-stone-500 mt-1'>Start a private conversation with your patients from here.</p>
      </div>

      <div>
        {loading ? (
          <div className='bg-white border border-stone-200 rounded-3xl shadow-sm text-center py-16 text-stone-500'>Loading patient list…</div>
        ) : patients.length === 0 ? (
          <div className='bg-white border border-stone-200 rounded-3xl shadow-sm text-center py-16 text-stone-500'>No patients found yet. Once you have appointments, patient chat will appear here.</div>
        ) : (
          <>
            <div className='mb-6'>
              <input
                type='search'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search patients by name'
                className='w-full rounded-3xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 shadow-sm outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-200'
              />
            </div>
            <div className='space-y-4'>
              {filteredPatients.length === 0 ? (
                <div className='bg-white border border-stone-200 rounded-3xl p-10 text-center text-stone-500 shadow-sm'>
                  No patients match that name.
                </div>
              ) : (
                filteredPatients.map((patient) => (
                  <div key={patient.userId} className='bg-white border border-stone-200 rounded-3xl p-5 shadow-sm hover:shadow-md hover:bg-stone-50 transition'>
                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                      <div className='flex items-center gap-4'>
                        <img className='w-16 h-16 rounded-3xl object-cover border border-stone-200' src={patient.image || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'} alt={patient.name} />
                        <div>
                          <h2 className='text-lg font-semibold text-stone-900'>{patient.name || 'Unknown Patient'}</h2>
                          <p className='text-sm text-stone-500'>Last appointment: {patient.lastSlotDate} | {patient.lastSlotTime}</p>
                          <p className='text-sm mt-1 text-stone-600'>Status: {patient.lastStatus}</p>
                        </div>
                      </div>
                      <div className='flex items-center gap-3'>
                        <button
                          onClick={() => startChat(patient)}
                          className='inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-black hover:bg-teal-200 transition'
                        >
                          <span className='text-xl leading-none'>+</span> Chat
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default DoctorPatientList
