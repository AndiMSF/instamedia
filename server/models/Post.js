import mongoose from "mongoose";

const postSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        location: String,
        description: String,
        picturePath: String, // post gambarnya si user
        userPicturePath: String, // profile images
        likes : {
            type: Map,
            of: Boolean,  // check jika userId exists di map itu, dan value nya akan true selalu kalo itu exists / ada
        }, // userId itu mengarah ke user2 yg telah login, kalo like dia akan dimasukin yaitu id nya ke likes field si user yang telah di like itu
        comments: {
            type:Array,
            default: []
        }
    }, { timestamps: true }
)

const Post = mongoose.model("Post", postSchema)

export default Post