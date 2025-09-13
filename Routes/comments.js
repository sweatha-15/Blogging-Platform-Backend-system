// Import Express and create a Router object.
// A Router is like a mini-app, used to group related routes.
const express = require('express');
const router = express.Router();

// Import the Comment model so we can interact with the comments collection in the database.
const Comment = require('../Models/Comment');

// ADDING NEW COMMENT
// This endpoint is called when a user submits a comment on a post.
router.post('/', async (req, res) => {
  try {
    // 1. Create a new comment object from the data sent in the request body (req.body).
    // The request should contain: { "text": "Great post!", "commenter": "USER_ID", "post": "POST_ID" }
    const newComment = new Comment(req.body);

    // 2. Save the new comment to the MongoDB database.
    // 'await' pauses the function until the save operation is complete.
    const savedComment = await newComment.save();

    // 3. Populate the 'commenter' field. By default, it only saves the user's ID.
    // This query finds the saved comment and replaces the 'commenter' ID with the actual user document, but only shows their username.
    await savedComment.populate('commenter', 'username');

    // 4. If successful, send back a 201 Created status and the new comment data (including the populated username).
    res.status(201).json(savedComment);

  } catch (error) {
    // 5. If anything goes wrong (e.g., missing data, invalid IDs), send a 400 Bad Request error.
    res.status(400).json({ error: error.message });
  }
});

//FETCH COMMENTS FOR POSTS
// This endpoint is called to load all comments for a particular post
// :postId is a URL parameter
router.get('/post/:postId', async (req, res) => {
  try {
    // 1. Find all comments in the database where the post field matches the postId from the URL.
    // 2. Use populate() to get the username of the commenter
    // 3. Sort them by creationDate in descending order (newest first).
    const comments = await Comment.find({ post: req.params.postId })
                                 .populate('commenter', 'username') // Get the commenter's username
                                 .sort({ creationDate: -1 }); // -1 means descending (newest first)

    // 4. Send the array of comments back to the client.
    res.json(comments);

  } catch (error) {
    // 5. If something goes wrong it will display invalid postId format
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/comments/:id - DELETE A COMMENT BY ITS ID
// This endpoint is called when a user wants to delete their comment.
// :id is the ID of the comment itself.
router.delete('/:id', async (req, res) => {
  try {
    // 1. Try to find the comment by its ID and delete it.
    // findByIdAndDelete is a convenient Mongoose method that does both in one step.
    const deletedComment = await Comment.findByIdAndDelete(req.params.id);

    // 2. If no comment was found with that ID, send a 404 Not Found error.
    if (!deletedComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // 3. If successfully deleted, send a confirmation message.
    res.json({ message: 'Comment deleted successfully' });

  } catch (error) {
    // 4. If something goes wrong, send a 500 error.
    res.status(500).json({ error: error.message });
  }
});

// Export the router so it can be used in our server.js file.
module.exports = router;