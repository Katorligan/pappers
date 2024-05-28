import express from 'express';
import { errorHandler } from './middlewares/errors';
import companyRoutes from './routes/company';
import jobRoutes from './routes/jobs';

const app = express();

export const jobsInProgress = new Set<string>();

// App routes
app.use('/company', companyRoutes);
app.use('/jobs', jobRoutes);

// Error handling
app.use(errorHandler);

export default app;
