import { Router, type IRouter } from "express";
import { login, logout, me, register } from "../controllers/authController";
import { requireAuth } from "../middleware/auth";

const router: IRouter = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/logout", logout);
router.get("/auth/me", requireAuth, me);

export default router;