const mongoose = require('mongoose');

const taskTypeSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      unique: true,
   },
});

module.exports = mongoose.model('TaskType', taskTypeSchema);