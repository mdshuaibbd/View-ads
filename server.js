const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// MongoDB URI from .env file
const mongoURI = process.env.MONGODB_URI;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error('MongoDB connection error:', err));

// User schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    points: { type: Number, default: 0 }
});

const User = mongoose.model('User', userSchema);

// Update points endpoint
app.post('/update-points', async (req, res) => {
    const { username } = req.body;
    try {
        let user = await User.findOne({ username });
        if (!user) {
            user = new User({ username, points: 0 }); // Create new user if not found
        }
        user.points += 1; // Increment points
        await user.save();
        res.json({ points: user.points });
    } catch (error) {
        console.error('Error updating points:', error);
        res.status(500).json({ message: 'Error updating points' });
    }
});

// Get points endpoint
app.post('/get-points', async (req, res) => {
    const { username } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user) {
            res.json({ points: user.points });
        } else {
            res.json({ points: 0 }); // Return 0 points if user not found
        }
    } catch (error) {
        console.error('Error fetching points:', error);
        res.status(500).json({ message: 'Error fetching points' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
