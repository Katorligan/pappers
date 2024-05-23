import { RequestHandler } from 'express';
import { Company } from '../types/types';
import { jobsInProgress } from '../app';

export const getCompany: RequestHandler = async (req, res, next) => {
	const siren = req.params.siren;

	// Make sure siren is 9 digits
	const regex = new RegExp(/^\d{9}$/);
	if (!regex.test(siren)) {
		return res.status(400).json({ error: 'SIREN parameter must be 9 digits' });
	}

	// Make sure API_KEY is known
	if (!process.env.API_KEY) {
		return next(new Error('API key is required'));
	}

	try {
		// Create job ID and add it to jobsInProgress Set
		const jobID = 'cy_' + siren + '_' + Date.now();
		jobsInProgress.add(jobID);

		// Process request, once request is done delete ID from jobsInProgress and log to server
		processCompanyRequest(siren).finally(() => {
			jobsInProgress.delete(jobID);
			console.log('Job ' + jobID + ' is finished');
		});

		// Log job to server
		console.log('New job started with ID : ' + jobID);

		return res.status(200).json({ message: 'Job started with ID : ' + jobID });
	} catch (err) {
		next(err);
	}
};

// Process company request : fetch company [to be added : query every company linked to each person in the company, send data to webhook]
async function processCompanyRequest(siren: string) {
	const company: Company = await fetchCompany(siren);
}

// Fetch company on Pappers API using siren
async function fetchCompany(siren: string) {
	const response = await fetch(`https://api.pappers.fr/v2/entreprise?api_token=${process.env.API_KEY}&siren=${siren}`);

	const company: Company = await response.json();

	return company;
}
