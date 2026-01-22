import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { SituationHelper } from "../helper/situation-helper";
import { inject } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { firstValueFrom } from "rxjs";
import { SituationService } from "../services/situation/situation.service";
import { UpdateSituationHelper } from "../helper/update-situation-helper";
import { CompletSituationHelper } from "../helper/complet-situation-helper";

export interface AddSituationState{
    situation : SituationHelper | null;
    allsituation : SituationHelper[] | null;
    allSituationInBd : SituationHelper[] | null;
    allComplet : CompletSituationHelper[] | null;
    isError : boolean;
    msgError : string | null;
    isLoading : boolean;
}

const initialState :AddSituationState = {
    situation : null,
    allsituation : [] as SituationHelper[],
    allSituationInBd : [] as CompletSituationHelper[],
    allComplet : [] as CompletSituationHelper[],
    isError : false,
    msgError : null,
    isLoading : false
}

export const AddSituationStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store,
        toastr = inject(ToastrService),
        service = inject(SituationService)
    ) =>({
        async getAll(){
            patchState(store,{isLoading : true,isError:false,msgError:null});
            try{
                const  saved = localStorage.getItem('sts');
                if(saved){
                    await patchState(store,{allsituation:JSON.parse(saved)});
                }
                patchState(store,{isLoading : false});
            }catch(err:any){
                patchState(store,{isError:true, msgError:err,isLoading : false})
                toastr.error(err, 'Erreur');
            }
        },
        async add(newSituation : SituationHelper){
            patchState(store,{isLoading : true,isError:false,msgError:null});
            try{
                await patchState(store,{allsituation:[newSituation,...(store.allsituation() ?? [])]});
                localStorage.setItem('sts',JSON.stringify(store.allsituation()));
                patchState(store,{isLoading : false});
            }catch(err:any){
                patchState(store,{isError:true, msgError:err,isLoading : false})
                toastr.error(err, 'Erreur');
            }
        },
        delete(situation : SituationHelper){
            patchState(store,{isError:true,msgError:null});
            try{
                const update = (store.allsituation() ?? []).filter(s => s !== situation);
                patchState(store, {allsituation : update});
                localStorage.setItem('sts',JSON.stringify(store.allsituation()));
                toastr.success("Un élément supprimer", 'Suppression OK');
            }catch (err: any) {
                patchState(store, { isError: true, msgError: err });
                toastr.error(err, 'Erreur suppression');
            }
        },
        update(oldSituation:SituationHelper,newSituation:SituationHelper){
            patchState(store,{isError:true,msgError:null});
            try{
                const update = (store.allsituation() ?? []).filter(s => s !== oldSituation);
                patchState(store, {allsituation : update});
                patchState(store,{allsituation:[newSituation,...(store.allsituation() ?? [])]});
                
            }catch (err: any) {
                patchState(store, { isError: true, msgError: err });
                toastr.error(err, 'Erreur suppression');
            }
        },
        async saveAll(){
            patchState(store,{isLoading : true,isError:false,msgError:null});
            try{
                const newList = await firstValueFrom(service.saveAll(store.allsituation()!));
                localStorage.removeItem('sts');
                
                patchState(store,{isLoading:false,allsituation:[] as SituationHelper[], allComplet:[...newList,...(store.allComplet() ?? [])]})
                toastr.success('Tous les éléments sont enregistrée', 'Enregistrement OK');
            }catch(err:any){
                const errorMessage = err?.detail;
                patchState(store,{isLoading:false, isError:true, msgError:errorMessage})
                toastr.error(errorMessage, 'Erreur');
            }
        },
        async allInBd(){
            patchState(store,{isLoading : true,isError:false,msgError:null});
            try{
                const allcs = await firstValueFrom(service.getAll());
                patchState(store,{isLoading:false, allComplet:allcs!})
            }catch(err:any){
                const errorMessage = err?.detail;
                patchState(store,{isLoading:false, isError:true, msgError:errorMessage})
                toastr.error(errorMessage, 'Erreur');
            }
        },
        async updateInBd(model:UpdateSituationHelper){
            patchState(store,{isLoading : true,isError:false,msgError:null});
            try{
                (store.allComplet() ?? []).filter(s => s != model);
                const updateSituation = await firstValueFrom(service.update(model));
                patchState(store,{allComplet:[updateSituation,...(store.allComplet() ?? [])], isLoading:false})
                toastr.info('Mise à jours éfféctuer', 'Mise à jours OK');
            }catch(err:any){
                patchState(store,{isError:true, msgError:err,isLoading : false})
                toastr.error(err, 'Erreur');
            }
        },
        async deleteInDb(model:CompletSituationHelper){
            patchState(store,{isLoading : true,isError:false,msgError:null});
            try{
                const newList = (store.allComplet()??[]).filter(s => s != model);
                await firstValueFrom(service.delete(model.produit.id));
                patchState(store,{allComplet:newList, isLoading:false});

                toastr.success("Un élément supprimer", 'Suppréssion OK');
            }catch(err:any){
                patchState(store,{isError:true, msgError:err,isLoading : false})
                toastr.error(err, 'Erreur');
            }
        }
        
    }))
)