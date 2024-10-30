// server.js
const express = require('express');
const cors = require('cors');
const path = require('path'); // নতুন যুক্ত করা হয়েছে
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // স্ট্যাটিক ফাইলের জন্য

// রুট হ্যান্ডলার
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'i.html')); // 'i.html' ফাইলটি ফেরত দেবে
});

// পয়েন্ট আপডেট করার এন্ডপয়েন্ট
app.post('/update-points', (req, res) => {
    const { userId } = req.body;
    
    // ইউজারের পয়েন্ট আপডেট করুন
    if (!userPoints[userId]) {
        userPoints[userId] = 0; // প্রথমবারের জন্য পয়েন্ট সেট করুন
    }
    userPoints[userId] += 1; // ১ পয়েন্ট যোগ করুন
    res.json({ points: userPoints[userId] }); // ইউজারের পয়েন্ট ফেরত দিন
});

// সার্ভার শুরু
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
