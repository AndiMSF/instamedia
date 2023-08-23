import express from "express"
import {
    getUser,
    getUserFriends,
    addRemoveFriend
} from "../controllers/users.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

// Get User Tertentu
router.get('/:id', verifyToken, getUser)
router.get('/:id/friends', verifyToken, getUserFriends)

// Update , remove / add teman
router.patch('/:id/:friendId', verifyToken, addRemoveFriend)

export default router