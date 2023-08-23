import Post from "../models/Post.js"
import User from "../models/User.js"

// CREATE POST
export const createPost = async (req, res) => { // ini handle file images di index.js
    try {
        const { userId, description, picturePath } = req.body // dari frontend cuma butuh 3 ini
        const user = await User.findById(userId)
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath, // profile image
            picturePath, //post Image
            likes : {
                // "id": true
                // andi: true , berarti andi suka sm postnya
            },
            comments: []
        })

        await newPost.save()

        // Mengambil semua post daru database dan menampilkannya ke frontend
        const post = await Post.find()
        res.status(201).json(post)
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}

// GET ALL POST
export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find()
        res.status(200).json(post)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

// GET USER POST berdasarkan id tertentu
export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params
        const post = await Post.find({userId})
        res.status(200).json(post)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

// LIKE COMMENTS
export const likePost = async (req, res) => {
    try {
        // ambil post id
        const { id } =  req.params
        // ambil user id
        const { userId } = req.body
        const post = await Post.findById(id)
        const isLiked = post.likes.get(userId) // kita check di field likes apakah ada userId atau orang tertentu di sana?
                                               // kalau ada berarti ada yang suka dongg sama postnya , ya kann?
        if (isLiked) {
            post.likes.delete(userId) // ini kalo ada userId di field likes kita cuma tinggal apus aja nnt pas di klik dari frontend
        } else {
            post.likes.set(userId, true) // kalo blm ada, ya kalo di klik dari frontend itu nanti jadi bertambah gitu like nya , dan di add ke field likes si userId nya
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id, // ini kita cari post nya, kalo udah ketemu...
            { likes: post.likes},  // disini likes fieldnya dari post itu akan terupdate dengan value yang baru 
            { new: true } // ini new object .. hmm ??? 
        )

        res.status(200).json(updatedPost)
    } catch (error) {
        res.status(404).json( { message: error.message })
    }
}