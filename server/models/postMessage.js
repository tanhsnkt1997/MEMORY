import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    title: String,
    message: String,
    name: String,
    creator: String,
    tags: [String],
    selectedFile: [String],
    reactions: [{ typeLike: String, userId: String }],
    avatar: String,
  },
  { timestamps: true }
);

//  postSchema.index({ title: "text", message:"text" });

const PostMessage = mongoose.model("PostMessage", postSchema);
export default PostMessage;
