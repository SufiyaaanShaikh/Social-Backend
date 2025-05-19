import express from 'express';
import {getFeedPosts, getUserPosts, likePost} from '../controllers/posts.js';
import { verifyToken } from '../middleware/auth.js';    

const router = express.Router();

router.get('/', verifyToken, getFeedPosts); // Get all posts
router.get('/:userId/posts', verifyToken, getUserPosts); // Get posts by user ID

router.patch('/:id/like', verifyToken, likePost); // Like a post

export default router;