import { EnqueteModel } from "../../models/enquete-model";
import { ESModel } from "../../models/esmodel";
import { EvenementModel } from "../../models/evenement-model";
import { Gadm } from "../../models/gadm";
import { RelationModel } from "../../models/relation-model";
import { TempsModel } from "../../models/temps-model";
import { ValMensuelModel } from "../../models/val-mensuel-model";

export interface VulnerabiliteHelper {
    enquete : EnqueteModel | null;
    evenement : EvenementModel | null;
    val_mensuel : ValMensuelModel | null;
    relation : RelationModel | null;
    es : ESModel;
    gadm : Gadm | null;
    temps : TempsModel;
}
