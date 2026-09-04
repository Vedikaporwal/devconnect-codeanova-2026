import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import usersRouter from "./users";
import projectsRouter from "./projects";
import blogsRouter from "./blogs";
import discoveryRouter from "./discovery";
import connectionsRouter from "./connections";
import socialRouter from "./social";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(usersRouter);
router.use(projectsRouter);
router.use(blogsRouter);
router.use(discoveryRouter);
router.use(connectionsRouter);
router.use(socialRouter);

export default router;
