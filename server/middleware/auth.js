import jwt from 'jsonwebtoken'

// Authorization 
export const verifyToken = async (req, res, next) => {
    try { 
        // kita akan ambil Authorization header dari frontend si req.
        let token = req.header("Authorization")

        if (!token) { return res.status(403).send("Not Allowed")}

        if (token.startsWith("Bearer ")) { 
            token = token.slice(7, token.length).trimLeft()
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET) 
        req.user = verified
        next()
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}