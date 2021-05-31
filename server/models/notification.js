import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
  {
    notification: String,
    senderId: String,
    receiverId: String,
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("notification", notificationSchema);
