import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminContext } from '../../context/AdminContext'

const PatientsEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { atoken, patients, getAllPatients, updatePatient } = useContext(AdminContext)
  const [patient, setPatient] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    address: { line1: '', line2: '' }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!atoken) return

    if (patients.length === 0) {
      getAllPatients()
    }
  }, [atoken])

  useEffect(() => {
    const selected = patients.find((item) => item._id === id)
    if (selected) {
      setPatient(selected)
      setFormData({
        name: selected.name || '',
        email: selected.email || '',
        phone: selected.phone || '',
        gender: selected.gender || '',
        dob: selected.dob || '',
        address: {
          line1: selected.address?.line1 || '',
          line2: selected.address?.line2 || ''
        }
      })
      setLoading(false)
    } else if (patients.length > 0) {
      setLoading(false)
    }
  }, [patients, id])

  useEffect(() => {
    if (!atoken) return
    if (patients.length > 0) setLoading(false)
  }, [patients.length, atoken])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const success = await updatePatient(id, formData)
    if (success) {
      navigate('/patients')
    }
  }

  if (!atoken) {
    return <div className='p-8 text-stone-700'>Unauthorized</div>
  }

  if (loading) {
    return <div className='p-8 text-stone-700'>Loading patient data...</div>
  }

  if (!patient) {
    return <div className='p-8 text-stone-700'>Patient not found.</div>
  }

  return (
    <div className='m-5 overflow-y-auto text-stone-800'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-black'>Edit Patient</h1>
        <p className='text-stone-500 mt-1'>Update this patient's profile information.</p>
      </div>

      <form onSubmit={handleSubmit} className='bg-white border border-stone-200 rounded-2xl shadow-lg p-6'>
        <div className='grid gap-4 md:grid-cols-2'>
          <label className='space-y-2'>
            <span className='text-sm font-medium text-stone-800'>Name</span>
            <input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className='w-full border border-stone-300 rounded-xl px-4 py-3 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-primary/20'
              required
            />
          </label>
          <label className='space-y-2'>
            <span className='text-sm font-medium text-stone-800'>Email</span>
            <input
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className='w-full border border-stone-300 rounded-xl px-4 py-3 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-primary/20'
              required
            />
          </label>
          <label className='space-y-2'>
            <span className='text-sm font-medium text-stone-800'>Phone</span>
            <input
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className='w-full border border-stone-300 rounded-xl px-4 py-3 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-primary/20'
              required
            />
          </label>
          <label className='space-y-2'>
            <span className='text-sm font-medium text-stone-800'>Date of Birth</span>
            <input
              type='date'
              value={formData.dob || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, dob: e.target.value }))}
              className='w-full border border-stone-300 rounded-xl px-4 py-3 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-primary/20'
              required
            />
          </label>
          <label className='space-y-2'>
            <span className='text-sm font-medium text-stone-800'>Gender</span>
            <select
              value={formData.gender}
              onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
              className='w-full border border-stone-300 rounded-xl px-4 py-3 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-primary/20'
              required
            >
              <option value=''>Select gender</option>
              <option value='Male'>Male</option>
              <option value='Female'>Female</option>
              <option value='Not Selected'>Not Selected</option>
            </select>
          </label>
          <label className='space-y-2 md:col-span-2'>
            <span className='text-sm font-medium text-stone-800'>Address Line 1</span>
            <input
              value={formData.address.line1}
              onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
              className='w-full border border-stone-300 rounded-xl px-4 py-3 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-primary/20'
            />
          </label>
          <label className='space-y-2 md:col-span-2'>
            <span className='text-sm font-medium text-stone-800'>Address Line 2</span>
            <input
              value={formData.address.line2}
              onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
              className='w-full border border-stone-300 rounded-xl px-4 py-3 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-primary/20'
            />
          </label>
        </div>

        <div className='mt-6 flex flex-wrap gap-3'>
          <button type='submit' className='px-6 py-3 rounded-xl bg-stone-900 text-white font-semibold hover:bg-stone-800 transition'>Confirm</button>
          <button type='button' onClick={() => navigate('/patients')} className='px-6 py-3 rounded-xl bg-stone-200 text-stone-800 font-semibold hover:bg-stone-300 transition'>Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default PatientsEdit
