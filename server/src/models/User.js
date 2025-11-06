import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  passwordHash: String,
  configKeyHash: String, // store hashed public key
  isConfigured: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
