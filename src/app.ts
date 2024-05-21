import express from 'express';
import { errorHandler } from './middlewares/errors';
import companyRoutes from './routes/company';

const app = express();

// App routes
app.use('/company', companyRoutes);

// Error handling
app.use(errorHandler);

export default app;
