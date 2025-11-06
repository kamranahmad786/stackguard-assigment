import mongoose from "mongoose";
export const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI, { autoIndex: true });
  console.log("Mongo connected");
};
