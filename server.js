require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB কানেকশন
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch(error => console.log("MongoDB connection error:", error));

// স্কিমা এবং মডেল ডিফাইন
const userSchema = new mongoose.Schema({
    username: String,
    points: { type: Number, default: 0 }
});
const User = mongoose.model('UserInfo', userSchema);

// পয়েন্ট আপডেট রুট
app.post('/update-points', async (req, res) => {
    const { username, points } = req.body;

    try {
        let user = await User.findOne({ username });
        if (user) {
            user.points = points;
        } else {
            user = new User({ username, points });
        }
        await user.save();
        res.status(200).send('Points updated successfully!');
    } catch (error) {
        res.status(500).send('Error updating points');
    }
});

// সার্ভার চালু
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
