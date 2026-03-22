import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { SituationHelper } from "../helper/situation-helper";
import { inject } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { firstValueFrom } from "rxjs";
import { SituationService } from "../services/situation/situation.service";
import { UpdateSituationHelper } from "../helper/update-situation-helper";
import { CompletSituationHelper } from "../helper/complet-situation-helper";
import { DisponibiliteHelper } from "../helper/disponibilite-helper";

export interface AddSituationState{
    situation : SituationHelper | null;
    allsituation : SituationHelper[] | null;
    allSituationInBd : SituationHelper[] | null;
    allComplet : CompletSituationHelper[] | null;
    isError : boolean;
    msgError : string | null;
    isLoading : boolean;
    listMap : CompletSituationHelper[] | null;
    selectChartComplet : CompletSituationHelper | null;
}

const initialState :AddSituationState = {
    situation : null,
    allsituation : [] as SituationHelper[],
    allSituationInBd : [] as CompletSituationHelper[],
    allComplet : [] as CompletSituationHelper[],
    isError : false,
    msgError : null,
    isLoading : false,
    listMap : [] as CompletSituationHelper[],
    selectChartComplet : null
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
                const errorMessage = err?.detail;
                patchState(store,{isError:true, msgError:errorMessage,isLoading : false})
                toastr.error(errorMessage, 'Erreur');
            }
        },
        async add(newSituation : SituationHelper){
            patchState(store,{isLoading : true,isError:false,msgError:null});
            try{
                await patchState(store,{allsituation:[newSituation,...(store.allsituation() ?? [])]});
                localStorage.setItem('sts',JSON.stringify(store.allsituation()));
                patchState(store,{isLoading : false});
            }catch(err:any){
                const errorMessage = err?.detail;
                patchState(store,{isError:true, msgError:errorMessage,isLoading : false})
                toastr.error(errorMessage, 'Erreur');
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
                const errorMessage = err?.detail;
                patchState(store, { isError: true, msgError: errorMessage });
                toastr.error(errorMessage, 'Erreur suppression');
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
        },
        async select_list_map(id:string){
            patchState(store,{isLoading : true,isError:false,msgError:null});
            const id_gadm = id.substring(0, id.length - 2);
            const new_list = await store.allComplet()?.filter(item => item.gadm.id.startsWith(id_gadm));
            patchState(store,{isLoading : false,listMap:new_list});
        },
        async select_one(id:string){
            patchState(store,{isLoading : true,isError:false,msgError:null});
            const select = await store.allComplet()?.find(c => c.produit.id.toLowerCase() === id.toLowerCase());
            if(select){
                patchState(store,{selectChartComplet:select,isLoading : false,isError:false,msgError:null});
            }
            else{
                patchState(store,{isLoading : false,isError:true,msgError:null});
                toastr.error("Aucun données sur cette produit", 'Erreur');
            }
        },
        async add_dispo(model:DisponibiliteHelper){
            patchState(store,{isLoading : true,isError:false,msgError:null});
            try{
                const new_csh = await firstValueFrom(service.addDispo(model));
                const new_liste = (store.allComplet() ?? []).filter(s => s.produit.id.toLowerCase() != model.id_prod.toLowerCase());
                patchState(store,{allComplet:[new_csh,...new_liste], isLoading:false})
                toastr.info('Disponibilité ajouté', 'ajout OK');
            }catch(err:any){
                patchState(store,{isError:true, msgError:err,isLoading : false})
                toastr.error(err, 'Erreur');
            }
        },
        async update_dispo(model:DisponibiliteHelper){
            patchState(store,{isLoading : true,isError:false,msgError:null});
            try{
                const new_dispo = await firstValueFrom(service.updateDispo(model));
                const updateListe = (store.allComplet() ?? []).map(s =>{
                    if(s.disponibilite && s.disponibilite.id && s.disponibilite.id === model.id.toLowerCase()){
                        return {
                            ...s,disponibilite:new_dispo
                        };
                    }
                    return s;
                });
                patchState(store,{allComplet:updateListe, isLoading:false})
                toastr.info('Disponibilité ajouté', 'ajout OK');
            }catch(err:any){
                patchState(store,{isError:true, msgError:err,isLoading : false})
                toastr.error(err, 'Erreur');
            }
        },
        async delete_dispo(id:string){
            patchState(store,{isLoading : true,isError:false,msgError:null});
            try{
                await firstValueFrom(service.deleteDispo(id));
                const new_liste = (store.allComplet() ?? []).filter(s => s.disponibilite.id.toLowerCase() != id.toLowerCase());
                patchState(store,{isLoading:false})
                toastr.info('Elément supprimer', 'Suppression OK');
            }catch(err:any){
                patchState(store,{isError:true, msgError:err,isLoading : false})
                toastr.error(err, 'Erreur');
            }
        },
    }))
)