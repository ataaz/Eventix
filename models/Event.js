const mongoose = require('mongoose');

     const eventSchema = new mongoose.Schema({
       title: {
         type: String,
         required: true,
         trim: true,
       },
       description: {
         type: String,
         trim: true,
       },
       date: {
         type: Date,
         required: true,
       },
       price: {
         type: Number,
         required: true,
         min: 0,
       },
       store: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Store',
         required: true,
       },
       createdAt: {
         type: Date,
         default: Date.now,
       },
     });

     module.exports = mongoose.model('Event', eventSchema);