import { EvenementModel } from "../../models/evenement-model";
import { TempsModel } from "../../models/temps-model";
import { ValMensuelModel } from "../../models/val-mensuel-model";

export interface UpdateVulnerabiliteHelper {
    val_mensuel : ValMensuelModel;
    evenement : EvenementModel;
    temps : TempsModel;
}
