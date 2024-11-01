const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// MongoDB Atlas connection
const MONGODB_URI = "mongodb+srv://shuaibhasan017:STP4gcl56oHKgQeg@cluster0.mongodb.net/AdPointSystem?retryWrites=true&w=majority";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Define User schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    points: { type: Number, default: 0 }
});

// Create User model
const User = mongoose.model('User', userSchema);

const app = express();
app.use(bodyParser.json());

// API endpoint to update points
app.post('/update-points', async (req, res) => {
    const { username } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ username });
        
        if (!user) {
            // Create new user if not exists
            user = new User({ username });
        }

        // Update points
        user.points += 1;
        await user.save();

        res.json({ success: true, points: user.points });
    } catch (error) {
        res.json({ success: false, message: 'Error updating points.' });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
