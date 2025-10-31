import express from 'express';
import {
  fetchLatestBlogs,
  fetchLatestBlogCount,
  fetchTrendingBlogs,
  searchBlogs,
  searchBlogCount,
  createBlog,
  getBlog,
  likeBlog
} from '../controller/blogController.js';
import { verifyJWT } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/latest-blogs', fetchLatestBlogs);
router.post('/all-latest-blog-count', fetchLatestBlogCount);
router.get('/trending-blogs', fetchTrendingBlogs);
router.post('/search-blogs', searchBlogs);
router.post('/search-blog-count', searchBlogCount);
router.post('/create-blog',verifyJWT, createBlog);
router.post('/get-blog', getBlog);
router.post('/like-blog', verifyJWT, likeBlog);


export default router;