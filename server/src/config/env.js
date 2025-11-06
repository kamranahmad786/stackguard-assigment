import dotenv from "dotenv";
export const configEnv = () => {
  dotenv.config();
  const required = ["MONGODB_URI", "JWT_SECRET"];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error("Missing env:", missing.join(", "));
    process.exit(1);
  }
};
