import express from 'express'
import bodyParser from 'body-parser'
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import multer from 'multer'
import helmet from "helmet"
import morgan from "morgan"
import path from "path"
import { fileURLToPath } from 'url'

// Routes file
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
// Controllers
import { register } from "./controllers/auth.js"
import { createPost } from "./controllers/posts.js"
import { verifyToken } from './middleware/auth.js'


// MIDDLEWARE CONFIGURATIONS
// * ini untuk type modules 
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ..
dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy: 'cross-origin'}))
app.use(morgan('common'))
app.use(bodyParser.json({limit:'30mb', extended:true}))
app.use(bodyParser.urlencoded({limit:'30mb', extended:true}))
app.use(cors())
// simpan image ke local
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))

// FILE STORAGE
// * ini caranya bagaimana webkita bisa save file ke destination di bawah , setiap ada yang upload file dan itu akan ke simpan di public/assets
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({storage}) // ini variabel yang akan kita gunakan setiap kita ingin upload file

// MONGOOSE SETUP
const PORT = process.env.PORT || 8080
mongoose.set('strictQuery',false)
async function connectDB () {
    try {
        const conn = await mongoose.connect("mongodb+srv://"+process.env.DB_USERNAME+":"+process.env.DB_PASSWORD+"@cluster0.vqcsdra.mongodb.net/SocialApps", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("MongoDB Connected : "+ conn.connection.host);
    } catch (error) {
        console.log(error + ' Failed to connect');
    }
}

// Routes dengan files
// kita butuh upload variabel dari multer sehingga tidak bisa dipindahkan ke routes folder
                        // Middleware untuk upload image ke local  yaitu di public/assets
app.post("/auth/register", upload.single('picture'), register)
app.post("/posts", verifyToken, upload.single("picture"), createPost)

// ..
app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use("/posts", postRoutes)









connectDB().then(() => app.listen(PORT, () => console.log('Server Running on '+ PORT)))