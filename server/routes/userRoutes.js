import express from 'express';
import { verifyJWT } from '../middleware/authMiddleware.js';
import { getProfile, isLikedByUser, searchUsers } from '../controller/userContoller.js';

const router = express.Router();

router.post('/search-users', searchUsers);
router.post('/get-profile', getProfile);
router.post('/isLiked-by-user', verifyJWT, isLikedByUser)

export default router;