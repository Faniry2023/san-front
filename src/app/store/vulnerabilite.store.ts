import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { VulnerabiliteHelper } from "../helper/vulnerabilite/vulnerabilite-helper";
import { inject, model } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { VulnerabiliteService } from "../services/vulnerabilite/vulnerabilite.service";
import { firstValueFrom } from "rxjs";
import { UpdateVulnerabiliteHelper } from "../helper/vulnerabilite/update-vulnerabilite-helper";

export interface VulnerabiliteState{
    vulnerabilite : VulnerabiliteHelper | null;
    listeVulnerabilite : VulnerabiliteHelper[];
    otherUpdateVulnerabilite: VulnerabiliteHelper | null;
    isLoading : boolean;
    msgError : string | null;
    isError : boolean;
    listMap : VulnerabiliteHelper[];
    selectChartVulnerabilite : VulnerabiliteHelper | null;
}

const initialState : VulnerabiliteState = {
    vulnerabilite : null,
    listeVulnerabilite : [] as VulnerabiliteHelper[],
    otherUpdateVulnerabilite : null,
    isLoading : false,
    msgError : null,
    isError : false,
    listMap : [] as VulnerabiliteHelper[],
    selectChartVulnerabilite : null
}

export const VulnerabiliteStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store,
        toastr = inject(ToastrService),
        service = inject(VulnerabiliteService)
    ) =>({
        async getAll(){
            patchState(store,{isLoading : true,isError:false,msgError:null});
            try{
                const newList = await firstValueFrom(service.getAll());
                patchState(store,{isLoading:false, listeVulnerabilite : newList});
            }catch(err:any){
                const errorMessage = err?.detail;
                patchState(store,{isError:true, msgError:errorMessage,isLoading : false})
                toastr.error(errorMessage, 'Erreur');
            }
        },
        async add(vlh : VulnerabiliteHelper){
            patchState(store,{isLoading : true,isError:false,msgError:null});
            try{
                const newVul = await firstValueFrom(service.add(vlh));
                patchState(store,{isLoading:false, listeVulnerabilite :[newVul,...(store.listeVulnerabilite() ?? [])]});
                toastr.success('Enregistrement de nouvealle vulnérabilité', 'Enregistrement OK');
            }catch(err:any){
                const errorMessage = err?.detail;
                patchState(store,{isLoading:false, isError:true, msgError:errorMessage})
                toastr.error(errorMessage, 'Erreur d\'enregistrement');
            }
        },
        async update(uvh : VulnerabiliteHelper, old : VulnerabiliteHelper){
            patchState(store,{isLoading : true,isError:false,msgError:null});
            try{
                const model : UpdateVulnerabiliteHelper = {
                    val_mensuel : uvh.val_mensuel!,
                    evenement : uvh.evenement!,
                    temps : uvh.temps,
                }
                const update = await firstValueFrom(service.update(model));
                patchState(store,{isLoading:false, listeVulnerabilite :[update,...store.listeVulnerabilite().filter(v => v!==old)]});
                toastr.info('Mise à jours éfféctuer', 'Mise à jours OK');
            }catch(err:any){
                const errorMessage = err?.detail;
                patchState(store,{isLoading:false, isError:true, msgError:errorMessage})
                toastr.error(errorMessage, 'Erreur d\'enregistrement');
            }
        },
        async delete(uvh : VulnerabiliteHelper){
            patchState(store,{isLoading : true,isError:false,msgError:null});
            try{
                await firstValueFrom(service.delete(uvh.evenement?.id!));
                const new_list = store.listeVulnerabilite().filter(v => v!==uvh);
                patchState(store,{isLoading:false, listeVulnerabilite :new_list});
                toastr.info('Un élément supprimer', 'Suppression OK');
            }catch(err:any){
                const errorMessage = err?.detail;
                patchState(store,{isLoading:false, isError:true, msgError:errorMessage})
                toastr.error(errorMessage, 'Erreur de suppression');
            }
        },
        async select_list_map(id:string){
            patchState(store,{isLoading : true,isError:false,msgError:null});
            const id_gadm = id.substring(0, id.length -2);
            const new_list = await store.listeVulnerabilite().filter(item => item.gadm?.id.startsWith(id_gadm));
            patchState(store,{isLoading : false,listMap:new_list});
        },
        async select_one(id : string){
            patchState(store,{isLoading : true,isError:false,msgError:null});
            const select = store.listeVulnerabilite().find(v => v.val_mensuel?.id.toLowerCase() === id.toLowerCase());
            if(select){
                patchState(store,{selectChartVulnerabilite:select,isLoading : false,isError:false,msgError:null});
            }else{
                 patchState(store,{isLoading : false,isError:true,msgError:null});
                 toastr.error("Aucun données sur cette valeur", 'Erreur');
            }
        }
    }))
)