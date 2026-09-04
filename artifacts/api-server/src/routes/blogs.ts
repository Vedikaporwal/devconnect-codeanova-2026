import { Router } from "express";
import { create, detail, list, remove, update } from "../controllers/blogController";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.get("/blogs", list);
router.get("/blogs/:id", detail);
router.post("/blogs", requireAuth, create);
router.put("/blogs/:id", requireAuth, update);
router.delete("/blogs/:id", requireAuth, remove);
export default router;