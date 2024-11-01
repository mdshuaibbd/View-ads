const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); 

// MongoDB URI
const uri = 'mongodb+srv://shuaibhasan017:STP4gcl56oHKgQeg@cluster0.mongodb.net/AdPointSystem?retryWrites=true&w=majority ';

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Create a schema and model for UserPoints
const userPointsSchema = new mongoose.Schema({
    username: { type: String, required: true },
    telegramUsername: { type: String, required: true },
    points: { type: Number, default: 0 }
});

const UserPoints = mongoose.model('AdPointsSystem', AdPointsSystemSchema);

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to add points
app.post('/addPoints', async (req, res) => {
    const { username, telegramUsername } = req.body;

    try {
        let user = await UserPoints.findOne({ username });

        if (!user) {
            user = new UserPoints({ username, telegramUsername });
        }

        user.points += 1;
        await user.save();

        res.json({ message: 'Points added!', points: user.points, telegramUsername });
    } catch (error) {
        res.status(500).json({ message: 'Error adding points', error });
    }
});

// Endpoint to get user points
app.get('/getPoints', async (req, res) => {
    const username = req.query.username;
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

// Serve index.html at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
