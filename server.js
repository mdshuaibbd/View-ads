const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'https://view-fs2d4k5lg-shuaib017s-projects.vercel.app', // Vercel URL
    credentials: true,
}));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// User schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    points: { type: Number, default: 0 }
});

// Use the specified collection name 'UserInfo'
const User = mongoose.model('UserInfo', userSchema); // Change here

// Update points endpoint
app.post('/update-points', async (req, res) => {
    const { username } = req.body;

    try {
        const user = await User.findOneAndUpdate(
            { username },
            { $inc: { points: 1 } },
            { new: true, upsert: true } // Create new user if not exists
        );
        res.json(user);
    } catch (error) {
        console.error('Error updating points:', error);
        res.status(500).send('Server error');
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
            res.json({ points: 0 }); // User not found
        }
    } catch (error) {
        console.error('Error fetching points:', error);
        res.status(500).send('Server error');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
