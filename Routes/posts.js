const express = require('express');
// @ts-ignore
const BlogPost = require('../Models/Blogpost');
const router = express.Router();
//----READ POSTS---
// PAGINATION
router.get('/', async (req, res) => {
    try {
        const { author, tag, page = 1, limit = 10, sort = '-creationDate' } = req.query;
        const query = {};
        if (author) query.author = author;
        if (tag) query.tags = tag; // Find posts where the tag is in the 'tags' array

        const posts = await BlogPost.find(query)
            .populate('author', 'username') // Populate author info, only show 'username'
            .limit(limit * 1) // Convert limit to number
            .skip((page - 1) * limit) // Calculate number of documents to skip
            .sort(sort); // e.g.creationDate for newest first

        //  Count total posts for pagination info
        const totalPosts = await BlogPost.countDocuments(query);
        const totalPages = Math.ceil(totalPosts / limit);

        // Enhanced response with pagination metadata
        res.json({
            posts,
            pagination: {
                currentPage: parseInt(page),
                totalPages: totalPages,
                totalPosts: totalPosts,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ --> Get a single post by ID
router.get('/:id', async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id).populate('author', 'username');
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CREATE POST
router.post('/', async (req, res) => {
    try {
        const newPost = new BlogPost(req.body);
        const savedPost = await newPost.save();
        await savedPost.populate('author', 'username'); // Populate author information after saving
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// UPDATE POST
router.put('/:id', async (req, res) => {
    try {
        const updatedPost = await BlogPost.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // `new: true` returns the updated document
        ).populate('author', 'username');

        if (!updatedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(updatedPost);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE POST
router.delete('/:id', async (req, res) => {
    try {
        const deletedPost = await BlogPost.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// LIKE/UPVOTES

// POST /api/posts/:id/like - LIKE A POST
router.post('/:id/like', async (req, res) => {
    try {
        const postId = req.params.id;
        const { userId } = req.body; // The ID of the user who is liking the post

        // Check if the user has already liked the post
        const post = await BlogPost.findById(postId);
        if (post.likes.includes(userId)) {
            return res.status(400).json({ error: 'You have already liked this post' });
        }

        // Add the user's ID to the likes array
        const updatedPost = await BlogPost.findByIdAndUpdate(
            postId,
            { $push: { likes: userId } }, // $push adds the userId to the likes array
            { new: true } // Return the updated document
        ).populate('author', 'username');

        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/posts/:id/unlike - UNLIKE A POST
router.post('/:id/unlike', async (req, res) => {
    try {
        const postId = req.params.id;
        const { userId } = req.body;

        // Remove the user's ID from the likes array
        const updatedPost = await BlogPost.findByIdAndUpdate(
            postId,
            { $pull: { likes: userId } }, // $pull removes the userId from the likes array
            { new: true }
        ).populate('author', 'username');

        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;