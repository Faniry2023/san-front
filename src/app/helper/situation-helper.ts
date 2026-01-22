import { ESModel } from "../models/esmodel";
import { ProduitModel } from "../models/produit-model";
import { TempsModel } from "../models/temps-model";

export interface SituationHelper {
    produit : ProduitModel;
    temps : TempsModel;
    es : ESModel;
}
