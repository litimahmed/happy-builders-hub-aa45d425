export interface TranslatableField {
  ar?: string;
  fr?: string;
  en?: string;
}

export interface PrivacyPolicyData {
  politique_id?: string;
  titre?: TranslatableField;
  contenu?: TranslatableField;
  version?: number;
  active?: boolean;
  date_creation?: string;
  historique_modifications?: any;
}
