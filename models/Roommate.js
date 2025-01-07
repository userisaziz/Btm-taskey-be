const mongoose = require('mongoose');

const RoommateSchema = new mongoose.Schema({
   name: { type: String, required: true },
});

module.exports = mongoose.model('Roommate', RoommateSchema);