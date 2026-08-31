import { Router, type IRouter } from "express";
import { getHealthStatus } from "../controllers/healthController";

const router: IRouter = Router();

router.get("/health", getHealthStatus);
router.get("/healthz", getHealthStatus);

export default router;
