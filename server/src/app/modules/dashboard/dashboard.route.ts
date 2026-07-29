import { Router } from "express";
import { checkAuth } from "../../middlewares/AuthMiddleware.ts";
import { Role } from "../user/user.interface.ts";
import { dashboardControllers } from "./dashboard.controller.ts";
import { userControllers } from "../user/user.controller.ts";

const router = Router();

router.get('/', checkAuth(Role.ADMIN), dashboardControllers.dashboardAnalytics);
router.get('/users', checkAuth(Role.ADMIN), userControllers.listUsersForAdmin);
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
