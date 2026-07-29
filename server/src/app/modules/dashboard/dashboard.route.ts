import { Router } from "express";
import { checkAuth } from "../../middlewares/AuthMiddleware.ts";
import { Role } from "../user/user.interface.ts";
import { dashboardControllers } from "./dashboard.controller.ts";

const router = Router();

router.get('/', checkAuth(Role.ADMIN), dashboardControllers.dashboardAnalytics);
router.get(
  '/revenue-trends',
  checkAuth(Role.ADMIN),
  dashboardControllers.getRevenueTrends,
);
router.get(
  '/transactions',
  checkAuth(Role.ADMIN),
  dashboardControllers.getTransactionHistory,
);


export const dashboardRouter = router;
