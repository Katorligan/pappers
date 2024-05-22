import { RequestHandler } from 'express';
import { Company } from '../types/types';

export const getCompany: RequestHandler = async (req, res, next) => {
	const siren = req.params.siren;

	// Making sure API_KEY is known
	if (!process.env.API_KEY) {
		return next(new Error('API key is required'));
	}

	try {
		const company: Company = await fetchCompany(siren);

		return res.status(200).json(JSON.stringify(company));
	} catch (err) {
		next(err);
	}
};

// Fetch company on Pappers API using siren
async function fetchCompany(siren: string) {
	const response = await fetch(`https://api.pappers.fr/v2/entreprise?api_token=${process.env.API_KEY}&siren=${siren}`);

	const company: Company = await response.json();

	return company;
}
