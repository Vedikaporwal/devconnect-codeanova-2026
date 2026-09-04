import { Router, type IRouter } from "express";
import {
  createMyProject,
  deleteMyProject,
  getMyProject,
  listMyProjects,
  updateMyProject,
} from "../controllers/projectController";
import { requireAuth } from "../middleware/auth";

const router: IRouter = Router();

router.use("/projects", requireAuth);
router.get("/projects", listMyProjects);
router.get("/projects/:id", getMyProject);
router.post("/projects", createMyProject);
router.put("/projects/:id", updateMyProject);
router.delete("/projects/:id", deleteMyProject);

export default router;