import { Router } from "express";
import { dashboard } from "../controllers/dashboardController";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.get("/dashboard", requireAuth, dashboard);
export default router;