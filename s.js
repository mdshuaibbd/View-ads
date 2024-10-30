// s.js

// ইউজারের আইডি
let userId = 'user123'; // এখানে ইউজারের আইডি পরিবর্তন করুন

        document.getElementById('kzQX_23FJ').addEventListener('click', function() {
            show_8442747().then(() => {
                // সার্ভারে পয়েন্ট আপডেট করা
                fetch('http://localhost:3000/update-points', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId })
                })
                .then(response => response.json())
                .then(data => {
                    document.getElementById('pointsDisplay').innerText = 'Points: ' + data.points;
                    alert('You have seen the ad! You earned 1 point.');
                })
                .catch(error => console.error('Error:', error));
            });
        });
