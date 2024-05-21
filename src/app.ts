import express from 'express';

const app = express();

// Test route
app.get('/', (req, res) => {
	res.send('Server response test');
});

export default app;
