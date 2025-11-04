import express from 'express';
import {
  fetchLatestBlogs,
  fetchLatestBlogCount,
  fetchTrendingBlogs,
  searchBlogs,
  searchBlogCount,
  createBlog,
  getBlog,
  likeBlog,
  imageUpload
} from '../controller/blogController.js';
import { verifyJWT } from '../middleware/authMiddleware.js';
import multer from 'multer';
const router = express.Router();
// const upload = multer({ dest: 'uploads/' });
const upload = multer({ storage: multer.memoryStorage() });

router.post('/latest-blogs', fetchLatestBlogs);
router.post('/all-latest-blog-count', fetchLatestBlogCount);
router.get('/trending-blogs', fetchTrendingBlogs);
router.post('/search-blogs', searchBlogs);
router.post('/search-blog-count', searchBlogCount);
router.post('/create-blog',verifyJWT, createBlog);
router.post('/get-blog', getBlog);
router.post('/like-blog', verifyJWT, likeBlog);
router.post('/upload', upload.single('image'), imageUpload);


export default router;