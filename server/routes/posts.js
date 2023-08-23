import express from "express"
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

// GET
// mengambil semua posts yang ada di database
router.get("/", verifyToken, getFeedPosts)
// mengambil posts dari user tertentu
router.get("/:userId/posts", verifyToken, getUserPosts)

// UPDATE untuk likePost 
router.patch("/:id/like", verifyToken, likePost)

export default router