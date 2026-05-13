import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['user', 'doctor'], required: true },
  text: { type: String, required: true },
  status: { type: String, enum: ['sent', 'received', 'read'], default: 'sent' },
  createdAt: { type: Number, default: () => Date.now() },
  editedAt: { type: Number, default: null },
  replyTo: {
    messageId: { type: String, default: '' },
    sender: { type: String, enum: ['user', 'doctor', ''], default: '' },
    text: { type: String, default: '' }
  },
  tempId: { type: String, default: '' }
}, { _id: true })

const chatSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  docId: { type: String, required: true },
  appointmentId: { type: String, default: '' },
  userName: { type: String, required: true },
  userImage: { type: String, default: '' },
  docName: { type: String, required: true },
  docImage: { type: String, default: '' },
  slotDate: { type: String, default: '' },
  slotTime: { type: String, default: '' },
  messages: { type: [messageSchema], default: [] },
  updatedAt: { type: Number, default: () => Date.now() }
}, { timestamps: true, minimize: false })

const chatModel = mongoose.models.chat || mongoose.model('chat', chatSchema)
export default chatModel
