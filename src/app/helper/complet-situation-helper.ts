import { EnqueteModel } from "../models/enquete-model";
import { ESModel } from "../models/esmodel";
import { Gadm } from "../models/gadm";
import { ProduitModel } from "../models/produit-model";
import { TempsModel } from "../models/temps-model";

export interface CompletSituationHelper {
    produit : ProduitModel;
    temps : TempsModel;
    es : ESModel;
    enquete : EnqueteModel;
    gadm : Gadm
}
