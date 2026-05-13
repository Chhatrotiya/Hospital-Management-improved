import appointmentModel from '../models/appointmentModel.js'
import chatModel from '../models/chatModel.js'
import userModel from '../models/userModel.js'
import doctorModel from '../models/doctorModel.js'

const buildSummary = (chat, currentRole) => {
  const unreadCount = chat.messages.reduce((count, message) => {
    if (currentRole === 'user' && message.sender === 'doctor' && message.status !== 'read') return count + 1
    if (currentRole === 'doctor' && message.sender === 'user' && message.status !== 'read') return count + 1
    return count
  }, 0)
  const latestMessage = chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null
  return {
    _id: chat._id,
    appointmentId: chat.appointmentId,
    userId: chat.userId,
    docId: chat.docId,
    userName: chat.userName,
    userImage: chat.userImage,
    docName: chat.docName,
    docImage: chat.docImage,
    slotDate: chat.slotDate,
    slotTime: chat.slotTime,
    latestMessage,
    unreadCount,
    updatedAt: chat.updatedAt
  }
}

const findOrCreateChat = async ({ userId, docId, appointmentId = '' }) => {
  let chat
  if (appointmentId) {
    chat = await chatModel.findOne({ userId, docId, appointmentId })
    if (chat) return chat
  } else {
    chat = await chatModel.findOne({ userId, docId })
    if (chat) return chat
  }

  let userName = ''
  let userImage = ''
  let docName = ''
  let docImage = ''
  let slotDate = ''
  let slotTime = ''

  if (appointmentId) {
    const appointment = await appointmentModel.findById(appointmentId)
    if (!appointment) return null
    userName = appointment.userData?.name || ''
    userImage = appointment.userData?.image || ''
    docName = appointment.docData?.name || ''
    docImage = appointment.docData?.image || ''
    slotDate = appointment.slotDate
    slotTime = appointment.slotTime
  } else {
    const user = await userModel.findById(userId)
    const doctor = await doctorModel.findById(docId)
    if (!user || !doctor) return null
    userName = user.name
    userImage = user.image || ''
    docName = doctor.name
    docImage = doctor.image || ''
  }

  chat = await chatModel.create({
    userId,
    docId,
    appointmentId,
    userName,
    userImage,
    docName,
    docImage,
    slotDate,
    slotTime,
    messages: [],
    updatedAt: Date.now()
  })

  return chat
}

const createUserChat = async (req, res) => {
  try {
    const { appointmentId, doctorId } = req.body
    const { userId } = req.body

    if (!appointmentId && !doctorId) {
      return res.json({ success: false, message: 'Appointment or doctor is required' })
    }

    if (appointmentId) {
      const appointment = await appointmentModel.findById(appointmentId)
      if (!appointment) return res.json({ success: false, message: 'Appointment not found' })
      if (String(appointment.userId) !== String(userId)) return res.json({ success: false, message: 'Not authorized for this appointment' })
      if (appointment.cancelled) return res.json({ success: false, message: 'Cannot chat on cancelled appointment' })

      const chat = await findOrCreateChat({ userId, docId: appointment.docId, appointmentId })
      return res.json({ success: true, chat })
    }

    const doctor = await doctorModel.findById(doctorId)
    if (!doctor) return res.json({ success: false, message: 'Doctor not found' })

    const chat = await findOrCreateChat({ userId, docId: doctorId })
    if (!chat) return res.json({ success: false, message: 'Unable to create chat with this doctor' })
    return res.json({ success: true, chat })
  } catch (err) {
    console.log(err)
    return res.json({ success: false, message: err.message })
  }
}

const listUserChats = async (req, res) => {
  try {
    const { userId } = req.body
    const chats = await chatModel.find({ userId }).sort({ updatedAt: -1 })
    const nonEmptyChats = chats.filter(chat => Array.isArray(chat.messages) && chat.messages.length > 0)
    const summaries = nonEmptyChats.map(chat => buildSummary(chat, 'user'))
    return res.json({ success: true, chats: summaries })
  } catch (err) {
    console.log(err)
    return res.json({ success: false, message: err.message })
  }
}

const getUserChatById = async (req, res) => {
  try {
    const { userId } = req.body
    const { chatId } = req.params
    const io = req.app.get('io')
    const chat = await chatModel.findById(chatId)
    if (!chat) return res.json({ success: false, message: 'Chat not found' })
    if (String(chat.userId) !== String(userId)) return res.json({ success: false, message: 'Not authorized' })

    let updated = false
    const updatedMessageEvents = []
    chat.messages = chat.messages.map(message => {
      if (message.sender === 'doctor' && message.status !== 'read') {
        updated = true
        updatedMessageEvents.push({ messageId: message._id.toString(), tempId: message.tempId || '', status: 'read' })
        return { ...message.toObject(), status: 'read' }
      }
      return message
    })

    if (updated) {
      chat.updatedAt = Date.now()
      await chat.save()
      if (io) {
        updatedMessageEvents.forEach(({ messageId, tempId, status }) => {
          const statusEvent = { chatId, messageId, tempId, status }
          io.to(`chat_${chatId}`).emit('messageStatusUpdate', statusEvent)
          io.to(`user_${chat.userId}`).emit('messageStatusUpdate', statusEvent)
          io.to(`doctor_${chat.docId}`).emit('messageStatusUpdate', statusEvent)
        })
      }
    }

    return res.json({ success: true, chat })
  } catch (err) {
    console.log(err)
    return res.json({ success: false, message: err.message })
  }
}

const createDoctorChat = async (req, res) => {
  try {
    const { appointmentId, userId } = req.body
    const { docId } = req.body

    if (!appointmentId && !userId) {
      return res.json({ success: false, message: 'Appointment or user is required' })
    }

    if (appointmentId) {
      const appointment = await appointmentModel.findById(appointmentId)
      if (!appointment) return res.json({ success: false, message: 'Appointment not found' })
      if (String(appointment.docId) !== String(docId)) return res.json({ success: false, message: 'Not authorized for this appointment' })
      if (appointment.cancelled) return res.json({ success: false, message: 'Cannot chat on cancelled appointment' })

      const chat = await findOrCreateChat({ userId: appointment.userId, docId, appointmentId })
      return res.json({ success: true, chat })
    }

    const chat = await findOrCreateChat({ userId, docId })
    if (!chat) {
      return res.json({ success: false, message: 'Unable to start chat with this patient' })
    }
    return res.json({ success: true, chat })
  } catch (err) {
    console.log(err)
    return res.json({ success: false, message: err.message })
  }
}

const listDoctorChats = async (req, res) => {
  try {
    const { docId } = req.body
    const chats = await chatModel.find({ docId }).sort({ updatedAt: -1 })
    const nonEmptyChats = chats.filter(chat => Array.isArray(chat.messages) && chat.messages.length > 0)
    const summaries = nonEmptyChats.map(chat => buildSummary(chat, 'doctor'))
    return res.json({ success: true, chats: summaries })
  } catch (err) {
    console.log(err)
    return res.json({ success: false, message: err.message })
  }
}

const getDoctorChatById = async (req, res) => {
  try {
    const { docId } = req.body
    const { chatId } = req.params
    const io = req.app.get('io')
    const chat = await chatModel.findById(chatId)
    if (!chat) return res.json({ success: false, message: 'Chat not found' })
    if (String(chat.docId) !== String(docId)) return res.json({ success: false, message: 'Not authorized' })

    let updated = false
    const updatedMessageEvents = []
    chat.messages = chat.messages.map(message => {
      if (message.sender === 'user' && message.status !== 'read') {
        updated = true
        updatedMessageEvents.push({ messageId: message._id.toString(), tempId: message.tempId || '', status: 'read' })
        return { ...message.toObject(), status: 'read' }
      }
      return message
    })

    if (updated) {
      chat.updatedAt = Date.now()
      await chat.save()
      if (io) {
        updatedMessageEvents.forEach(({ messageId, tempId, status }) => {
          const statusEvent = { chatId, messageId, tempId, status }
          io.to(`chat_${chatId}`).emit('messageStatusUpdate', statusEvent)
          io.to(`user_${chat.userId}`).emit('messageStatusUpdate', statusEvent)
          io.to(`doctor_${chat.docId}`).emit('messageStatusUpdate', statusEvent)
        })
      }
    }

    return res.json({ success: true, chat })
  } catch (err) {
    console.log(err)
    return res.json({ success: false, message: err.message })
  }
}

export { createUserChat, listUserChats, getUserChatById, createDoctorChat, listDoctorChats, getDoctorChatById }
