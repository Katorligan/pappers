import { Router } from 'express';
import { getCompany } from '../controllers/company';

const router = Router();

router.get('/:siren', getCompany);

export default router;
