import { ProduitModel } from "../models/produit-model";
import { TempsModel } from "../models/temps-model";

export interface UpdateSituationHelper {
    produit : ProduitModel;
    temps : TempsModel;
}
