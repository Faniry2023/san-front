import { DisponibiliteModel } from "../models/disponibilite-model";
import { EnqueteModel } from "../models/enquete-model";
import { ESModel } from "../models/esmodel";
import { Gadm } from "../models/gadm";
import { ProduitModel } from "../models/produit-model";
import { TempsModel } from "../models/temps-model";
import { DisponibiliteHelper } from "./disponibilite-helper";

export interface CompletSituationHelper {
    produit : ProduitModel;
    temps : TempsModel;
    es : ESModel;
    enquete : EnqueteModel;
    gadm : Gadm
    disponibilite:DisponibiliteHelper
}
