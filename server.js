const express = require('express');
const mongoose = require('mongoose');
// Import routes
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB (Use the same connection string as in seedData.js)
const mongoURI='mongodb://localhost:27017/';
//const mongoURI = 'mongodb+srv://yourUsername:yourPassword@cluster0.xxxxx.mongodb.net/yourDatabaseName?retryWrites=true&w=majority';

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected for API...'))
    .catch(err => console.log(err));

// Use Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// Basic route to test if server is working
app.get('/', (req, res) => {
    res.send('Blogging Platform API is Running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});