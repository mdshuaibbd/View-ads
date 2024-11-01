const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

// User Schema
const userSchema = new mongoose.Schema({
    username: String,
    points: { type: Number, default: 0 }
}, { collection: 'UserInfo' }); // Specify collection name

const User = mongoose.model('User', userSchema);

// Update Points API
app.post('/update-points', async (req, res) => {
    const { username } = req.body;
    try {
        const user = await User.findOneAndUpdate(
            { username: username },
            { $inc: { points: 1 } },
            { new: true, upsert: true } // upsert: true creates a new document if it doesn't exist
        );
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating points" });
    }
});

// Get Points API
app.post('/get-points', async (req, res) => {
    const { username } = req.body;
    try {
        const user = await User.findOne({ username: username });
        if (user) {
            res.status(200).json({ points: user.points });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching points" });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
