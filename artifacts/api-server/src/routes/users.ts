import { Router, type IRouter } from "express";
import { getMyProfile, updateMyProfile } from "../controllers/userController";
import { requireAuth } from "../middleware/auth";

const router: IRouter = Router();

router.get("/users/me", requireAuth, getMyProfile);
router.put("/users/me", requireAuth, updateMyProfile);

export default router;