const mongoose = require('mongoose');

     const userSchema = new mongoose.Schema({
       email: {
         type: String,
         required: true,
         unique: true,
         lowercase: true,
         trim: true,
       },
       password: {
         type: String,
         required: true,
       },
       role: {
         type: String,
         enum: ['user', 'admin'],
         default: 'user',
       },
       storeIds: [{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Store',
       }],
       createdAt: {
         type: Date,
         default: Date.now,
       },
     });

     module.exports = mongoose.model('User', userSchema);