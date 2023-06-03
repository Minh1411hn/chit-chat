const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    email: {type:String,  unique: true, required: true},
    password: String,
    avatar: String,
}, { timestamps: true });

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;