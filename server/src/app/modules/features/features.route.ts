import express from 'express';
import * as featuresController from './features.controller.ts';

const router = express.Router();

router.get('/FeaturesList', featuresController.FeaturesList);
router.get('/legalDetails/:type', featuresController.LegalDetails);

export const featuresRouter = router;
