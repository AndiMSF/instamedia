// encrypt password
import bcrypt from "bcrypt"
// ini untuk user authorization sehingga bisa akses ke endpoint tertentu dengan token
import jwt from "jsonwebtoken";
// User Model
import User from "../models/User.js";

// Register
export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body  // ambil dari frontend

        // encrypt password
        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password, salt)

        // Membuat User memakai Schema yang telah kita buat di User.js
        const newUser = new User({
            firstName,
            lastName,
            email,
            password : passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000),
        })
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body // ambil dari frontend
        const user = await User.findOne({ email: email });
        // jika tidak ada user...
        if (!user) return res.status(400).json({ msg: 'User does not exist' })

        // lanjutt.. jadi ini akan mengcompare password yang user masukan di frontend
        // dengan di database yang sudah di hash dengan bcrypt
        // contoh frontend , password : 123, di database : dwaiasdbawuyod1239dankwldna itu hash
        // jadi 123 akan di check sama bcrypt si tukang hash apakah hasil hash nya dari 123 sama dengan yang di database 
        const isMatch = await bcrypt.compare(password, user.password)
        // jika tidak sama...
        if (!isMatch) return res.status(400).json({ msg: 'Wrong Username/Password' })

        // ini kita akan berikan token untuk authorization si user setelah login
        const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET)
        // kita delete user.password agar password tidak terkirim ke frontend , karena bahaya yaa!
        delete user.password
        res.status(200).json({ token, user })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}