import { Router } from "express";
import { checkAuth } from "../../middlewares/AuthMiddleware.ts";
import { Role } from "../user/user.interface.ts";
import { dashboardControllers } from "./dashboard.controller.ts";

const router = Router();

router.get('/', checkAuth(Role.ADMIN), dashboardControllers.dashboardAnalytics);


export const dashboardRouter = router;