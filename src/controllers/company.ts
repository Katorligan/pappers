import { RequestHandler } from 'express';
import { Company, Person } from '../types/types';
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
		// Create unique job ID and add it to jobsInProgress Set
		const jobID = 'cy_' + siren + '_' + Date.now();
		jobsInProgress.add(jobID);

		// Process request, once request is done delete ID from jobsInProgress and log to server.
		processCompanyRequest(siren)
			.catch((err) => {
				console.log('Job ' + jobID + ' failed');
				console.error(err);
			})
			.finally(() => {
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

// Process company request : fetch company, for each person in the company search all linked companies [to be added : send data to webhook]
async function processCompanyRequest(siren: string) {
	const company = await fetchCompany(siren);

	if (!company) {
		throw new Error('Something went wrong while fetching company');
	}

	company.representants.forEach(async (person) => {
		const linkedCompanies = await searchLinkedCompanies(person);

		if (!linkedCompanies) {
			throw new Error('Something went wrong while searching for linked companies');
		}
	});
}

// Fetch company on Pappers API using siren
async function fetchCompany(siren: string) {
	const response = await fetch(`https://api.pappers.fr/v2/entreprise?api_token=${process.env.API_KEY}&siren=${siren}`);

	// Check response status according to Pappers API doc
	if (response.status === 200 || response.status === 206) {
		const company: Company = await response.json();

		return company;
	} else if (response.status === 400) {
		console.log('Bad request');
	} else if (response.status === 401) {
		console.log('API key is incorrect');
	} else if (response.status === 404) {
		console.log('No company found');
	} else {
		console.log('Unknown error occured');
	}
}

// Search person on Pappers API and return all companies linked to this person
async function searchLinkedCompanies(person: Person) {
	// Create query according to juridical person or physical person
	let queryParam: string;
	if (person.personne_morale) {
		queryParam = `q=${person.denomination}&siren=${person.siren}`;
	} else {
		queryParam = `q=${person.nom_complet}&date_de_naissance_dirigeant_min=${person.date_de_naissance}&date_de_naissance_dirigeant_max=${person.date_de_naissance}`;
	}

	const response = await fetch(`https://api.pappers.fr/v2/recherche-dirigeants?api_token=${process.env.API_KEY}&precision=exacte&${queryParam}`);

	// Check response status according to Pappers API doc
	if (response.status === 200) {
		const data = await response.json();
		const linkedCompanies: Company[] = data.resultats[0].entreprises;

		return linkedCompanies;
	} else if (response.status === 401) {
		console.log('API key is incorrect');
	} else if (response.status === 404) {
		console.log('No person found');
	} else if (response.status === 503) {
		console.log('Service momentarily unavailable');
	} else {
		console.log('Unknown error occured');
	}
}
