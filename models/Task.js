const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
   },
   dateCompleted: {
      type: Date,
      required: true,
   },
   completedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Roommate',
      required: true,
   },
});

module.exports = mongoose.model('Task', taskSchema);