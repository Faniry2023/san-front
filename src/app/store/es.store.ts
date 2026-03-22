import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { ESModel } from "../models/esmodel";
import { inject } from "@angular/core";
import { EsService } from "../services/ES/es.service";
import { firstValueFrom } from "rxjs";
import { ToastrService } from "ngx-toastr";

export interface EsState{
    esModel:ESModel | null;
    select_Es_Local:ESModel | null;
    liste_es:ESModel[] | null;
    isLoading:boolean;
    isError:boolean;
    errorMsg:string | null;
}

const initialState:EsState = {
    esModel : null,
    select_Es_Local : null,
    liste_es : [] as ESModel[],
    isLoading : false,
    isError : false,
    errorMsg : null,
}

export const EsStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store,
        service = inject(EsService),
        toastr = inject(ToastrService)
    ) =>({
        async getAllEs(){
            patchState(store,{isLoading:true,isError:false});
            try{
                const list_es = await firstValueFrom(service.getAll());
                patchState(store,{isLoading:false, isError:false, liste_es:list_es});
            }catch(err:any){
                const errorMessage = err?.detail;
                patchState(store,{isLoading:false, isError:true, errorMsg:errorMessage})
            
            }
        },
        async getOneById(id:string){
            patchState(store,{isLoading:true,isError:false});
            try{
                const es = await firstValueFrom(service.getById(id));
                patchState(store,{isLoading:false, isError:false, esModel:es});
            }catch(err:any){
                const errorMessage = err?.detail;
                patchState(store,{isLoading:false, isError:true, errorMsg:errorMessage})
                toastr.error(errorMessage, 'Erreur');
            }
        },
        async createNewEs(model:ESModel){
            patchState(store,{isLoading:true,isError:false});
            try{
                const newEs = await firstValueFrom(service.create(model));
                patchState(store,{isLoading:false, isError:false, esModel:newEs,liste_es:[newEs,...(store.liste_es() ?? [])]});
                toastr.success('ES enregistrer avec succèes', 'Enregistrement OK');
            }catch(err:any){
                const errorMessage = err?.detail;
                patchState(store,{isLoading:false, isError:true, errorMsg:errorMessage})
                toastr.error(errorMessage, 'Erreur');
            }
        },
        selectEs(id : string){
            patchState(store,{isLoading:true,isError:false});
            const situation = store.liste_es()?.find(s => s.id.toLowerCase() === id);
            if(situation){
                patchState(store,{isLoading:false,select_Es_Local:situation});        
            }else{
                toastr.error("Aucun Es trouvées", 'Erreur');
                patchState(store,{isLoading:false,isError:false});
            }
        }
    }))
)