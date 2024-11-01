const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); 

// MongoDB URI
const uri = 'mongodb+srv://shuaibhasan017:cpLJrxdiYSCS0hN5@cluster0.rpgvp.mongodb.net/AdPointsSystem?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Create a schema and model for UserPoints
const userPointsSchema = new mongoose.Schema({
    username: { type: String, required: true },
    telegramUsername: { type: String, required: true }, // Add Telegram username
    points: { type: Number, default: 0 }
});

const UserPoints = mongoose.model('UserPoints', userPointsSchema);

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to add points
app.post('/addPoints', async (req, res) => {
    const { username, telegramUsername } = req.body; // Get both usernames

    try {
        // Check if user already exists
        let user = await UserPoints.findOne({ username });

        // If user does not exist, create a new one
        if (!user) {
            user = new UserPoints({ username, telegramUsername });
        }

        // Increment points
        user.points += 1;
        await user.save();

        res.json({ message: 'Points added!', points: user.points, telegramUsername }); // Send back Telegram username
    } catch (error) {
        res.status(500).json({ message: 'Error adding points', error });
    }
});

// Endpoint to get user points
app.get('/getPoints', async (req, res) => {
    const username = req.query.username; // Get the username from query params
    try {
        const user = await UserPoints.findOne({ username });
        if (user) {
            res.json({ points: user.points });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user points', error });
    }
});

// Create a basic GET route for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));  // Serve the HTML file
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
