// Import the mongoose library
const mongoose = require('mongoose');
// Import bcryptjs for password hashing
const bcrypt = require('bcryptjs');

// User Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String, // Must be text
        required: true, // Cannot be empty
        unique: true // No two users can have the same username
    },
    email: {
        type: String,
        required: true,
        unique: true,
        //Simple check to see if it looks like an email
        match: [/.+\@.+\..+/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true,
        //Password must be at least 6 characters
        minlength: 6
    },
    registrationDate: {
        type: Date, // Must be a date
        default: Date.now // If not provided, use the current date/time
    }
});

// Middleware - This function runs just before a user is saved
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified
    if (!this.isModified('password')) return next();
    // Hash the password with a "cost" of 12
    this.password = await bcrypt.hash(this.password, 12);
    // Tell mongoose to move on to the next step
    next();
});

// Create a model based on the schema. Model names are usually capitalized.
// This makes the User model available to other files.
module.exports = mongoose.model('User', userSchema);