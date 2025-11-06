import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import { hash } from "./utils/hash.js";

dotenv.config();

const args = process.argv.slice(2);

function getArg(flag) {
  const i = args.indexOf(flag);
  if (i < 0) return null;
  if (i + 1 < args.length && !args[i + 1].startsWith("--")) return args[i + 1];
  return true;
}

const email = getArg("--email") || "demo@stackguard.dev";
const password = getArg("--password") || "password123";
const configured = !!getArg("--configured");
const key = getArg("--key");

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error("Missing MONGODB_URI");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      email,
      passwordHash: await hash(password),
      isConfigured: false
    });
    console.log("Created user:", email);
  } else {
    console.log("User exists:", email);
  }

  if (configured) {
    if (!key || key.length < 100) {
      console.error("When using --configured, provide --key with length >= 100");
      process.exit(1);
    }
    user.configKeyHash = await hash(key);
    user.isConfigured = true;
    await user.save();
    console.log("Marked user configured");
  }

  await mongoose.disconnect();
  console.log("✅ Done seeding.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
