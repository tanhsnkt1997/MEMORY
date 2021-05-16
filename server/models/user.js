import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String },
  gender: { type: String },
  birthDay: { type: Number, default: 633805200000 },
  avatar: { type: String, default: "https://i.pinimg.com/564x/51/f6/fb/51f6fb256629fc755b8870c801092942.jpg" },
  token: { type: String },
  refreshToken: { type: String },
});

export default mongoose.model("User", userSchema);
