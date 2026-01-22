import { NoConnexHelper } from "../helper/no-connex-helper";
import { RetoureKoboFormulaireHelper } from "../helper/retoure-kobo-formulaire-helper";
import { FormulaireKoboModel } from "../models/formulaire-kobo-model";

export function isReponseKoboModel(value:RetoureKoboFormulaireHelper | NoConnexHelper | null):value is RetoureKoboFormulaireHelper{
    return !!value && 'koboAssets' in value;
}