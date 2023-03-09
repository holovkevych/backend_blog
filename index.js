import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import { validationResult } from "express-validator";
import { registerValidation } from './validations/auth.js' 
import UserSchema from './models/User.js'

mongoose.connect('mongodb+srv://admin:admin@cluster1.y2g6dph.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err))

const app = express()

app.use(express.json())

app.get('/', (req,res) => {
  res.send('4xd44hello world')
})

app.post('/auth/login', async (req, res) => {
  try {
    const user = await UserSchema.findOne({ email: req.body.email })
    
    if(!user) {
      return res.status(404).json({
        message: 'Користувача не знайдено!',
      })
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

    if (!isValidPass) {
      return res.status(400).json({
        message: 'Неправильний логін або пароль!',
      })
    }

    const token = jwt.sign({
      _id: user._id,
    }, 
    'secret123',
    {
      expiresIn: '30d',
    },
  )

    const { passwordHash, ...userData } = user._doc
      
      res.json({
        ...userData,
        token,
      })

  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не вдалося авторизуватися!'
    })
  }
})

app.post('/auth/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      return res.status(400).json(errors.array())
    }

    const password = req.body.password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt)

    const doc = new UserSchema({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    })

    const user = await doc.save()

    const token = jwt.sign({
      _id: user._id,
    }, 
    'secret123',
    {
      expiresIn: '30d',
    },
  )

    const { passwordHash, ...userData } = user._doc
    
    res.json({
      ...userData,
      token,
    })
  }
  catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не вдалося зареєструватися!'
    }) 
  }
})

app.get('/auth/me', (req, res) => {
  try {

  } catch (err) {

  }
})

app.listen(4444, (err) => {
  if(err) {
    return console.log(err) 
  }  

  console.log('Server OK')
})