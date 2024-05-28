import { RequestHandler } from 'express';
import { jobsInProgress } from '../app';

export const getJobsInProgress: RequestHandler = async (req, res, next) => {
	if (jobsInProgress.size === 0) {
		return res.status(200).json({ message: 'No jobs in progress' });
	}

	// Return an array with jobs IDs
	return res.status(200).json(Array.from(jobsInProgress));
};
