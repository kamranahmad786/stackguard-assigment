import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { me, setConfig, validateConfig, verifyKey } from "../controllers/userController.js";

const router = Router();
router.get("/me", auth(false), me);
router.post("/config", auth(false), validateConfig, setConfig);
router.post("/verify-config", auth(false), verifyKey);
router.get("/private-check", auth(true), (_req, res) => res.json({ ok: true }));

export default router;
