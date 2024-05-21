import express from 'express';
import { errorHandler } from './middlewares/errors';

const app = express();

// Test route
app.get('/', (req, res) => {
	res.send('Server response test');
});

// Error handling
app.use(errorHandler);

export default app;
