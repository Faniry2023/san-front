import { ReponseKoboModel } from "../models/reponse-kobo-model";

export interface ReponseApiKoboHelper {
    nbrSoummission:number;
    tailler:number;
    reponse_dico:Record<string,ReponseKoboModel[]>;
}
