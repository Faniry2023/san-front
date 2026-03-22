import { FormulaireKoboModel } from "../models/formulaire-kobo-model";
import { KoboAssetModel } from "./kobo-asset-model";

export interface RetoureKoboFormulaireHelper {
    isLess:boolean;
    isMore:boolean;
    koboAssets:KoboAssetModel[];
    koboForm:FormulaireKoboModel[];
    countNew:number;
    countDel:number;
    alert:boolean;
    notDel:string[];
}
