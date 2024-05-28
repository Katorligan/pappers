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

export interface OutputCompany {
	name: string;
	siren: string;
}

export interface OutputRepresentative {
	name: string;
	companies: OutputCompany[];
}

export class OutputData {
	name: string;
	siren: string;
	representatives: OutputRepresentative[];

	constructor(name: string, siren: string) {
		this.name = name;
		this.siren = siren;
		this.representatives = [];
	}
}
