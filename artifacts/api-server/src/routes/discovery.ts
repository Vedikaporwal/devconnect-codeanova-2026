import { Router } from "express";
import { discover, publicProfile } from "../controllers/discoveryController";

const router = Router();
router.get("/users/discover", discover);
router.get("/users/:id", publicProfile);
export default router;