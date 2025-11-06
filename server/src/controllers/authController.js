import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { hash, compare } from "../utils/hash.js";
import { generateKeyPairSync } from "crypto";
import { body, validationResult } from "express-validator";

/**
 * @desc Register new user and auto-generate RSA key pair
 */
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const passwordHash = await hash(password);

    // Generate RSA key pair
    const { publicKey, privateKey } = generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });

    // Hash public key before saving
    const configKeyHash = await hash(publicKey);

    // Save new user
    const user = await User.create({
      email,
      passwordHash,
      configKeyHash,
      isConfigured: true,
    });

    // Sign JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, isConfigured: true },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send private key to user for download
    res.status(201).json({
      message: "Account created successfully.",
      token,
      privateKey,
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Registration failed." });
  }
};

/**
 * @desc Login existing user
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const valid = await compare(password, user.passwordHash);
    if (!valid) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, email: user.email, isConfigured: user.isConfigured },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Login failed." });
  }
};

/**
 * Validation middlewares for register/login
 */
export const validateRegister = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
];

export const validateLogin = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
];
