import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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
        picturePath: String,
        picturePathID: String,
        userPicturePath: String,
        likes: {
        type: Map,
        of: Boolean,
        default: {},
        },
        comments: {
        type: Array,
        default: [],
        },
    },
    { timestamps: true }
    );

    const Post = mongoose.model("Post", postSchema);
    export default Post;