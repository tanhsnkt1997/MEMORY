import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  gender: { type: String, required: true },
  birthDay: { type: Number, required: true },
  avatar: { type: String, required: true, default: "https://i.pinimg.com/564x/51/f6/fb/51f6fb256629fc755b8870c801092942.jpg" },
  token: { type: String },
  refreshToken: { type: String },
});

export default mongoose.model("User", userSchema);
