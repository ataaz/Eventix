const mongoose = require('mongoose');

     const storeSchema = new mongoose.Schema({
       name: {
         type: String,
         required: true,
         trim: true,
       },
       slug: {
         type: String,
         required: true,
         unique: true,
         lowercase: true,
         trim: true,
       },
       owner: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
       },
       createdAt: {
         type: Date,
         default: Date.now,
       },
     });

     module.exports = mongoose.model('Store', storeSchema);