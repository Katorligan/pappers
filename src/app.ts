import express from 'express';
import { errorHandler } from './middlewares/errors';
import companyRoutes from './routes/company';
import jobRoutes from './routes/jobs';

const app = express();

export const jobsInProgress = new Set<string>();

// Make sure API_KEY is known
if (!process.env.API_KEY) {
	throw new Error('API key is required');
}

// App routes
app.use('/company', companyRoutes);
app.use('/jobs', jobRoutes);

// Error handling
app.use(errorHandler);

export default app;
