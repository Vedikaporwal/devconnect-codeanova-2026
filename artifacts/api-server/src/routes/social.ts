import { Router } from "express";
import { add, addSkill, deleteSkill, endorsements, remove, skills, userSkills } from "../controllers/socialController";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.get("/skills", skills);
router.get("/users/:userId/skills", userSkills);
router.get("/users/:userId/endorsements", endorsements);
router.post("/users/me/skills", requireAuth, addSkill);
router.delete("/users/me/skills/:skillId", requireAuth, deleteSkill);
router.post("/users/:userId/endorsements", requireAuth, add);
router.delete("/users/:userId/endorsements/:skillId", requireAuth, remove);
export default router;