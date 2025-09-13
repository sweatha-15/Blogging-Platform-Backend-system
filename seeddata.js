const mongoose = require('mongoose');
const User = require('./Models/User');
const BlogPost = require('./Models/Blogpost');
const Comment = require('./Models/Comment');

// Connect to your MongoDB (Replace the connection string with your Atlas string or local URI)
const mongoURI = 'mongodb://localhost:27017/';
// 'mongodb+srv://yourUsername:yourPassword@cluster0.xxxxx.mongodb.net/yourDatabaseName?retryWrites=true&w=majority';
async function seedData() {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');

        // CLEAR EXISTING DATA (Be careful with this in real projects!)
        await User.deleteMany({});
        await BlogPost.deleteMany({});
        await Comment.deleteMany({});

        // 1. CREATE USERS
        const user1 = await User.create({
            username: 'testuser1',
            email: 'user1@example.com',
            password: 'password123' // This will be hashed by our pre-save hook!
        });

        const user2 = await User.create({
            username: 'testuser2',
            email: 'user2@example.com',
            password: 'securepass456'
        });
        console.log('Sample users created');

        // 2. CREATE BLOG POSTS
        const post1 = await BlogPost.create({
            title: 'My First ADT Assignment',
            content: 'This is the content of my first amazing blog post.',
            author: user1._id, // Reference the User's ID
            tags: ['beginner', 'coding', 'life']
        });

        const post2 = await BlogPost.create({
            title: 'Hello, Welcome',
            content: 'Welcome to ADT Assignment-1',
            author: user2._id,
            tags: ['webdev', 'javascript']
        });
        console.log('Sample blog posts created');

        // 3. CREATE COMMENTS
        await Comment.create({
            text: 'Great first assignment! Welcome to blogging.',
            commenter: user2._id, // Jane comments on John's post
            post: post1._id
        });

        await Comment.create({
            text: 'Hope you are doing well!',
            commenter: user1._id, // John comments on Jane's post
            post: post2._id
        });
        console.log('Sample comments created');

        console.log('Database seeding completed successfully!');

    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Disconnected from MongoDB');
    }
}

seedData();