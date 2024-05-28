const mongoose = require('mongoose');

const neoSchema = new mongoose.Schema({
    name: String,
    nasa_jpl_url: String,
    is_potentially_hazardous_asteroid: Boolean,
    close_approach_date: Date,
    relative_velocity: String,
    miss_distance: String,
});

module.exports = mongoose.model('Neo', neoSchema);
