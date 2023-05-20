const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('./models/User');
const cors = require('cors');

dotenv.config();
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });
const jwtSecret = process.env.JWT_SECRET;

app.use(express.json());
app.use(cors({
    credentials:true,
    origin: process.env.CLIENT_URL,
}));

app.get('/test', (req, res) => {
    res.json('test ok');
});

app.post('/register', async (req, res) => {
   const { username, password } = req.body;
   try {
       const createdUser = await User.create({ username, password });
       jwt.sign({userId:createdUser._id}, jwtSecret,{},(err,token)=>{
           if (err) throw err;
           res.cookie('token',token).status(201).json({
               id: createdUser._id,
           });
       });
   } catch(err) {
       if (err) throw err;
       res.status(500).json('error')
   }

});

app.listen(4000);