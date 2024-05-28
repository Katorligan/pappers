import { Router } from 'express';
import { getJobsInProgress } from '../controllers/jobs';

const router = Router();

router.get('/', getJobsInProgress);

export default router;
