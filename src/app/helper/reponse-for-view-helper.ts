import { FormulaireKoboModel } from "../models/formulaire-kobo-model";
import { QuestionKoboModel } from "../models/question-kobo-model";
import { ReponseKoboModel } from "../models/reponse-kobo-model";
import { ReponseApiKoboHelper } from "./reponse-api-kobo-helper";

export interface ReponseForViewHelper {
    formulaire:FormulaireKoboModel;
    reponse_soumi:ReponseApiKoboHelper[];
    questions_dico:Record<string, QuestionKoboModel[]>;
}
