import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import botsRouter from "./bots.js";
import adminRouter from "./admin.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(botsRouter);
router.use(adminRouter);

export default router;
