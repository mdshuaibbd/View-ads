// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// MongoDB URI
const uri = 'mongodb+srv://shuaibhasan017:dRECBF4nCOwrnnzl@cluster0.rpgvp.mongodb.net/AdPointsSystem?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Create a schema and model for UserPoints
const userPointsSchema = new mongoose.Schema({
    username: { type: String, required: true },
    points: { type: Number, default: 0 }
});

const UserPoints = mongoose.model('UserPoints', userPointsSchema);

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Endpoint to add points
app.post('/addPoints', async (req, res) => {
    const { username } = req.body;

    try {
        // Check if user already exists
        let user = await UserPoints.findOne({ username });
        
        // If user does not exist, create a new one
        if (!user) {
            user = new UserPoints({ username });
        }
        
        // Increment points
        user.points += 1;
        await user.save();

        res.json({ message: 'Points added!', points: user.points });
    } catch (error) {
        res.status(500).json({ message: 'Error adding points', error });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
