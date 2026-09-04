import { Router } from "express";
import { accept, create, list, reject, remove } from "../controllers/connectionController";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.use("/connections", requireAuth);
router.get("/connections", list);
router.post("/connections/:userId", create);
router.patch("/connections/:id/accept", accept);
router.patch("/connections/:id/reject", reject);
router.delete("/connections/:id", remove);
export default router;