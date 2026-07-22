import express from 'express';
import { categoryControllers } from './category.controller.ts';

const router = express.Router();

router.get('/ProductCategoryList', categoryControllers.getCategoryList);

export const categoryRouter = router;
