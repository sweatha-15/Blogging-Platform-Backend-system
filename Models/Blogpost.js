const mongoose = require('mongoose');
const blogPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    // This is the ONE-TO-MANY relationship
    // The 'author' field will store the unique ID of a User
    author: {
        type: mongoose.Schema.Types.ObjectId, // This is the type for a MongoDB ID
        ref: 'User', // This tells Mongoose which model this ID refers to
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    tags: [String], // This is an array of strings=> e.g., ['tech', 'coding']
    likes: {
        type: [mongoose.Schema.Types.ObjectId], // Array of User IDs
        ref: 'User',
        default: [] // Start with an empty array
    }
});

module.exports = mongoose.model('BlogPost', blogPostSchema);