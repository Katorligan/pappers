export interface Company {
	siren: string;
	nom_entreprise: string;
	representants: Person[];
}

export interface Person {
	personne_morale: boolean;
	denomination?: string;
	siren?: string;
	nom_complet: string;
	date_de_naissance?: string;
}
