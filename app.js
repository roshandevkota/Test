const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const neoRoutes = require('./routes/neoRoutes');

// Load environment variables from .env file
dotenv.config();

const app = express();
const { PORT, MONGODB_URI } = process.env;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


// app.use(express.json());
app.use('/api/neo', neoRoutes);
app.use(express.static('public'));


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
