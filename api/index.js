const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Message = require('./models/Message');
const ws = require('ws');
const {response} = require("express");
const timers = require("timers");
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const md5 = require('blueimp-md5');

dotenv.config();
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });

const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);


const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: [`${process.env.CLIENT_URL}`],
}));
app.set("trust proxy", 1);

async function getUserDataFromRequest(req) {
    return new Promise((resolve, reject) => {
        const token = req.cookies?.token;
        if (token) {
            jwt.verify(token, jwtSecret, {}, (err, userData) => {
                if (err) throw err;
                resolve(userData);
            });
        } else {
            reject('no token');
        }
    });

}


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ dest: 'uploads/' });


app.post('/api/upload/avatar', upload.single('file'), (req, res) => {
    const file = req.file;
    const userId = req.body.userId;
    const username = req.body.username;
    const email = req.body.email;

    // Upload file to Cloudinary
    cloudinary.uploader.upload(
        file.path,
        { folder: 'avatars' }, // Optional folder in Cloudinary
        async (error, result) => {
            if (error) {
                console.log('Upload error:', error);
                res.status(500).json({ error: 'Error uploading image to Cloudinary' });
            } else {
                const imageUrl = result.secure_url;
                console.log('Image URL:', imageUrl);

                try {
                    // Update the user's avatar field in the database
                    const user = await User.findByIdAndUpdate(userId, { avatar: imageUrl }, { new: true });

                    // Sign a new token with the updated avatar field
                    const token = jwt.sign({ userId, email, username, avatar: imageUrl }, jwtSecret, {});

                    // Send the new token to the client in a cookie
                    res.cookie('token', token, { sameSite: 'none', secure: true }).status(201).json({
                        userId,
                        email,
                        username,
                        imageUrl, // Update the field name to 'imageUrl'
                    });
                } catch (error) {
                    console.log('Database error:', error);
                    res.status(500).json({ error: 'Error updating user avatar' });
                }
            }
        }
    );

});

app.get('/api/test', (req, res) => {
    res.json('test ok');
});


app.get('/api/messages/:userId', async (req,res) => {
    const {userId} = req.params;
    const userData = await getUserDataFromRequest(req);
    const ourUserId = userData.userId;
    const messages = await Message.find({
        sender: {$in:[userId, ourUserId]},
        recipient: {$in:[userId, ourUserId]},
    }).sort({createdAt:1});
    res.json(messages);
})

app.get('/api/people', async (req,res)=>{
   const users = await User.find({},{'_id':1,username: 1,email:1,avatar:1});
   res.json(users);
});

app.get('/api/profile', (req,res) => {
    const token = req.cookies?.token;
    if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
            if (err) throw err;
            res.json(userData);
        });
    } else {
        res.status(401).json('no token');
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email });

    if (!foundUser) {
        // If the email is not found, respond with a 404 error
        return res.status(404).json({ message: 'Email not found' });
    }

    const passOk = bcrypt.compareSync(password, foundUser.password);
    if (!passOk) {
        // If the password is incorrect, respond with a 401 error
        return res.status(401).json({ message: 'Incorrect password' });
    }

    const avatar = foundUser.avatar;
    jwt.sign({ userId: foundUser._id, email, username: foundUser.username, avatar }, jwtSecret, {}, (err, token) => {
        res.cookie('token', token, { sameSite: 'none', secure: true }).json({
            id: foundUser._id,
            username: foundUser.username,
            avatar,
        });
    });
});


app.post('/api/logout', (req,res)=>{
    res.cookie('token', '', {sameSite:'none', secure:true}).json('ok');
})

app.post('/api/register', async (req, res) => {
   const { email, password, username } = req.body;
   try {
       const hashedPassword = bcrypt.hashSync(password,bcryptSalt);
       const createdUser = await User.create({
           email:email,
           password:hashedPassword,
           username:username,
       });

       jwt.sign({userId:createdUser._id,email,usernamem}, jwtSecret, {}, (err, token) => {
           if (err) throw err;
           res.cookie('token', token, {sameSite:'none', secure:true}).status(201).json({
               id: createdUser._id,
               email,
               username,
           });
       });
   } catch(err) {
       if (err) throw err;
       res.status(500).json('error')
   }

});

const server = app.listen(4040);
const wss = new ws.WebSocketServer({server});
wss.on('connection', (connection, req) => {

    function notifyAboutOnlinePeople() {
        [...wss.clients].forEach(client => {
            client.send(JSON.stringify({
                online: [...wss.clients].map(c => ({userId:c.userId,email:c.email,username:c.username,avatar:c.avatar})),
            }));
        });
    }

    connection.isAlive = true;

    connection.timer = setInterval(() => {
        connection.ping();
        connection.deathTimer = setTimeout(() => {
            connection.isAlive = false;
            clearInterval(connection.timer);
            connection.terminate();
            notifyAboutOnlinePeople();
        }, 1000);
    }, 3000);

    connection.on('pong', () => {
        clearTimeout(connection.deathTimer);
    });


    const cookies = req.headers.cookie;
    if (cookies) {
        const tokenCookieString = cookies.split(';').find(str => str.startsWith('token='));
        if (tokenCookieString) {
            const token =tokenCookieString.split('=')[1];
            if (token) {
                jwt.verify(token, jwtSecret,{}, (err,userData) =>{
                    if (err) throw err;
                    const {userId, email, username, avatar} = userData;
                    connection.userId = userId;
                    connection.email = email;
                    connection.username = username;
                    connection.avatar = avatar;
                });
            }
        }

    }

    connection.on('message', async (message) => {
        const messageData = JSON.parse(message.toString());
        const {recipient, text, createdAt} = messageData;
        if (recipient && text && createdAt) {
            const messageDoc = await Message.create({
                sender: connection.userId,
                recipient,
                text,
                createdAt,
            });
            [...wss.clients]
                .filter(c => c.userId === recipient)
                .forEach(c => c.send(JSON.stringify({
                    text,
                    createdAt,
                    sender:connection.userId,
                    recipient,
                    _id:messageDoc._id})));
        }
    });

    //notify user about online users (when someone connects)
    notifyAboutOnlinePeople();
});

