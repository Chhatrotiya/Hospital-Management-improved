import express from 'express'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoutes.js'
import doctorRouter from './routes/doctorRoutes.js'
import userRouter from './routes/userRoutes.js'
import chatModel from './models/chatModel.js'

const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

app.use(express.json());
app.use(cors());

app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)

app.get('/', (req, res) => {
    res.send('server is listening')
})

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: true,
    methods: ['GET', 'POST']
  }
})
app.set('io', io)

const getUserFromToken = (token) => {
  try {
    if (!token) return null
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    return null
  }
}

io.on('connection', (socket) => {
  socket.on('joinUser', async ({ role } = {}) => {
    try {
      const token = socket.handshake.auth?.token
      const decoded = getUserFromToken(token)
      if (!decoded) {
        socket.emit('error', 'Authentication required')
        return
      }

      if (role === 'doctor') {
        socket.join(`doctor_${decoded.id}`)
        return
      }

      socket.join(`user_${decoded.id}`)
    } catch (error) {
      console.log(error)
      socket.emit('error', 'Unable to join user room')
    }
  })

  socket.on('joinChat', async ({ chatId, role }) => {
    try {
      const token = socket.handshake.auth?.token
      const decoded = getUserFromToken(token)
      if (!decoded) {
        socket.emit('error', 'Authentication required')
        return
      }

      const chat = await chatModel.findById(chatId)
      if (!chat) {
        socket.emit('error', 'Chat not found')
        return
      }

      const isUser = role === 'user' && chat.userId === decoded.id
      const isDoctor = role === 'doctor' && chat.docId === decoded.id
      if (!isUser && !isDoctor) {
        socket.emit('error', 'Not authorized for this chat')
        return
      }

      const room = `chat_${chatId}`
      socket.join(room)

      const updatedMessageEvents = []
      chat.messages = chat.messages.map((message) => {
        if (isUser && message.sender === 'doctor' && message.status !== 'read') {
          updatedMessageEvents.push({ messageId: message._id.toString(), tempId: message.tempId || '', status: 'read' })
          return { ...message.toObject(), status: 'read' }
        }
        if (isDoctor && message.sender === 'user' && message.status !== 'read') {
          updatedMessageEvents.push({ messageId: message._id.toString(), tempId: message.tempId || '', status: 'read' })
          return { ...message.toObject(), status: 'read' }
        }
        return message
      })

      if (updatedMessageEvents.length) {
        chat.updatedAt = Date.now()
        await chat.save()
        updatedMessageEvents.forEach(({ messageId, tempId, status }) => {
          const statusEvent = { chatId, messageId, tempId, status }
          io.to(room).emit('messageStatusUpdate', statusEvent)
          io.to(`user_${chat.userId}`).emit('messageStatusUpdate', statusEvent)
          io.to(`doctor_${chat.docId}`).emit('messageStatusUpdate', statusEvent)
        })
      }
    } catch (error) {
      console.log(error)
      socket.emit('error', 'Unable to join chat')
    }
  })

  socket.on('sendMessage', async ({ chatId, text, sender, tempId }) => {
    try {
      const token = socket.handshake.auth?.token
      const decoded = getUserFromToken(token)
      if (!decoded) {
        socket.emit('error', 'Authentication required')
        return
      }

      const chat = await chatModel.findById(chatId)
      if (!chat) {
        socket.emit('error', 'Chat not found')
        return
      }

      const room = `chat_${chatId}`
      const recipientRoom = sender === 'doctor' ? `user_${chat.userId}` : `doctor_${chat.docId}`
      const isValidSender =
        (sender === 'user' && chat.userId === decoded.id) ||
        (sender === 'doctor' && chat.docId === decoded.id)
      if (!isValidSender) {
        socket.emit('error', 'Invalid sender')
        return
      }

      const message = {
        sender,
        text,
        status: 'sent',
        createdAt: Date.now(),
        tempId: tempId || ''
      }
      chat.messages.push(message)
      chat.updatedAt = Date.now()

      const recipientClients = io.sockets.adapter.rooms.get(recipientRoom)
      const recipientConnected = recipientClients && recipientClients.size > 0
      if (recipientConnected) {
        chat.messages[chat.messages.length - 1].status = 'received'
      }

      await chat.save()
      const savedMessage = chat.messages[chat.messages.length - 1]
      io.to(room).emit('chatMessage', { message: savedMessage })

      if (recipientConnected) {
        const statusEvent = {
          chatId,
          messageId: savedMessage._id,
          tempId: savedMessage.tempId || '',
          status: 'received'
        }
        io.to(room).emit('messageStatusUpdate', statusEvent)
        io.to(`user_${chat.userId}`).emit('messageStatusUpdate', statusEvent)
        io.to(`doctor_${chat.docId}`).emit('messageStatusUpdate', statusEvent)
      }

      if (sender === 'doctor') {
        io.to(`user_${chat.userId}`).emit('newMessage', { chatId, messageId: savedMessage._id })
      }
      if (sender === 'user') {
        io.to(`doctor_${chat.docId}`).emit('newMessage', { chatId, messageId: savedMessage._id })
      }
    } catch (error) {
      console.log(error)
      socket.emit('error', 'Unable to send message')
    }
  })

  socket.on('disconnect', () => {
    // cleanup is handled automatically by socket.io
  })
})

server.listen(port, () => {
  console.log(`server is running on ${port}`)
})
