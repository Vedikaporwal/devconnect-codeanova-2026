import { Router } from "express";
import { list, markAllRead, markRead } from "../controllers/notificationController";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.use("/notifications", requireAuth);
router.get("/notifications", list);
router.patch("/notifications/:id/read", markRead);
router.patch("/notifications/read-all", markAllRead);
export default router;