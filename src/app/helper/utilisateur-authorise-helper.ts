import { AuthoriseModel } from "../models/authorise-model";
import { UtilisateurModel } from "../models/utilisateur-model";
import { UtilisateurHelper } from "./utilisateur-helper";

export interface UtilisateurAuthoriseHelper {
    utilisateur:UtilisateurModel;
    authorise:AuthoriseModel;
    photo:string;
}
