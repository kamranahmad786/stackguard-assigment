import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import { hash, compare } from "../utils/hash.js";

import jwt from "jsonwebtoken";

const signToken = (user) =>
  jwt.sign({ id: user._id, email: user.email, isConfigured: user.isConfigured }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

export const me = async (req, res) => {
  const user = await User.findById(req.user.id).select("email isConfigured createdAt");
  res.json({ user });
};

export const validateConfig = [
  body("configKey").isLength({ min: 100, max: 1000 }).withMessage("Key must be between 100 and 1000 characters")
];

export const setConfig = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { configKey } = req.body;
  const user = await User.findById(req.user.id);
  user.configKeyHash = await hash(configKey);
  user.isConfigured = true;
  await user.save();

  const token = signToken(user);
  res.json({ message: "Configuration saved", token });
};

export const verifyKey = async (req, res) => {
  const { configKey } = req.body;
  if (!configKey) return res.status(400).json({ message: "configKey required" });
  const user = await User.findById(req.user.id);
  if (!user?.configKeyHash) return res.status(400).json({ message: "No key saved" });
  const ok = await compareHash(configKey, user.configKeyHash);
  res.json({ valid: ok });
};
