import express from "express"
import { login } from "../controllers/auth.js"

const router = express.Router()
            // /auth/login , /auth di dapatkan di index.js , /auth menjadi prefix nya.
router.post('/login', login)

export default router