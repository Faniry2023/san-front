import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { RetoureKoboFormulaireHelper } from "../helper/retoure-kobo-formulaire-helper";
import { FormulaireKoboModel } from "../models/formulaire-kobo-model";
import { inject } from "@angular/core";
import { KoboService } from "../services/kobotoolbox/kobo.service";
import { ToastrService } from "ngx-toastr";
import { isReponseKoboModel } from "../guards/isReponseKoboModel";
import { firstValueFrom } from "rxjs";
import { ReponseForViewHelper } from "../helper/reponse-for-view-helper";
import { NoConnexHelper } from "../helper/no-connex-helper";
import { ApiKeyKoboModel } from "../models/api-key-kobo-model";

export interface KoboToolboxState{
    retoureProjects:RetoureKoboFormulaireHelper | NoConnexHelper | null;
    formulaireKobo:FormulaireKoboModel | null;
    formulaires:FormulaireKoboModel[] | null;
    isError:boolean;
    error:string | null;
    loading:boolean;
    isFormTab:boolean;
    reponseForViewH:ReponseForViewHelper | null;
    isOnline:boolean;
    loading_data:boolean;
    apiOk:boolean;
    deleteOk : boolean;
    ajoutOk : boolean;
    isSynch : boolean | undefined;
}
const initialState: KoboToolboxState = {
    retoureProjects : null,
    formulaireKobo : null,
    formulaires:[] as FormulaireKoboModel[],
    isError : false,
    error : null,
    loading : false,
    isFormTab : false,
    reponseForViewH : null,
    isOnline:false,
    loading_data:false,     
    apiOk : false, 
    deleteOk : false,
    ajoutOk : false,
    isSynch : false,
}

export const KoboToolboxStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store,
        service = inject(KoboService),
        toastr = inject(ToastrService)
    ) =>({
        async getAllProject(){
            patchState(store, {loading:true, isError:false});
            try{
                const project = await firstValueFrom(service.GelAllProjetcts());
                if(isReponseKoboModel(project)){
                    patchState(store, {loading:false, retoureProjects:project, isError:false, isFormTab:false})
                }else{
                    patchState(store, {loading:false, formulaires:project?.liste_formulaire, isOnline:project?.isconnect, isError:false, isFormTab:true})
                }
                
            }catch(err:any){
                const msgError = err?.detail;
                patchState(store, {isError:true, loading:false, error:msgError});
                console.log("error store : " + msgError);
                toastr.error(msgError,"Récupération des formulaire");
            }
        },
        async ChangeForm(payload:RetoureKoboFormulaireHelper){
            patchState(store,{loading:true,isError:false});
            try{
                const formulaires = await firstValueFrom(service.ChangeKobo(payload));
                patchState(store,{loading:false, formulaires:formulaires, retoureProjects:null, isFormTab:true});
            }catch(err:any){
                const msgError = err?.detail;
                patchState(store, {isError:true, loading:false, error:msgError});
                toastr.error(msgError,"Récupération des formulaire");
            }
        },
        async dataViewForOneForm(uid:string){
            patchState(store,{loading:false,isError:false,loading_data:true});
            try{
                const reponseForView = await firstValueFrom(service.repForViHelper(uid));
                patchState(store, {loading_data:false, isError:false,reponseForViewH:reponseForView});
            }catch(err:any){
                const msgError = err?.detail;
                patchState(store, {isError:true, loading_data:false, error:msgError});
                console.log("error store : " + msgError);
                toastr.error(msgError,"Récupération des formulaire");
            }
        },
        async testApi(){
            patchState(store,{loading:false,isError:false,loading_data:true,apiOk:false});
            try{
                const reponse = await firstValueFrom(service.testApi());
                patchState(store, {loading_data:false, isError:false,apiOk:reponse});
            }catch(err:any){
                const msgError = err?.detail;
                patchState(store, {isError:true, loading_data:false, error:msgError});
                console.log("error store : " + msgError);
            }
        },
        async delete(){
            patchState(store,{loading_data:true,isError:false,deleteOk:false});
            try{
                const reponse = await firstValueFrom(service.deleteApi());
                patchState(store, {loading_data:false, isError:false,deleteOk:reponse,apiOk:false});
                toastr.success('Votre key API est bien supprimer de nos données','Suppression d\'API key KOBO')
            }catch(err:any){
                const msgError = err?.detail;
                patchState(store, {isError:true, loading_data:false, error:msgError});
                console.log("error store : " + msgError);
                toastr.error(msgError,"Erreur de suppression d'api");
            }
        },
        async addApi(model:ApiKeyKoboModel){
            patchState(store,{isError:false,loading_data:true,ajoutOk:false});
            try{
                const rps = await firstValueFrom(service.addApi(model));
                patchState(store, {loading_data:false, isError:false,ajoutOk:rps,apiOk:true});
            }catch(err:any){
                const msgError = err?.detail;
                patchState(store, {isError:true, loading_data:false, error:msgError});
                toastr.error(msgError,"Erreur de suppression d'api");
            }
        },
        videProjet(){
            patchState(store,{isError:false,loading_data:true,ajoutOk:false});
            try{
                patchState(store, {formulaires:[] as FormulaireKoboModel[], loading_data:false,isError:false,retoureProjects:null,formulaireKobo:null,reponseForViewH:null});
            }catch(err:any){
                const msgError = err?.detail;
                patchState(store, {isError:true, loading_data:false, error:msgError});
                console.log("error store : " + msgError);
                toastr.error(msgError,"Erreur de suppression d'api");
            }
        },
        async SynchroOneForm(uid : string){
            patchState(store,{isError:false,loading_data:true,isSynch:false});
            try{
                const rps = await firstValueFrom(service.synchOneForm(uid));
                patchState(store, {loading_data:false, isError:false,isSynch:rps});
            }catch(err:any){
                const msgError = err?.detail;
                patchState(store, {isError:true, loading_data:false, error:msgError});
                toastr.error(msgError,"Erreur de synchronisation d'api");
            }
        }
    }))
)