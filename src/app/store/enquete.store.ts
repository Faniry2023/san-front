import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { EnqueteModel } from "../models/enquete-model";
import { inject } from "@angular/core";
import { EnqueteService } from "../services/enquete/enquete.service";
import { ToastrService } from "ngx-toastr";
import { firstValueFrom } from "rxjs";

export interface EnqueteState{
    enquete : EnqueteModel | null;
    enquetes : EnqueteModel[] | null;
    isError : boolean;
    msgError : string | null;
    isLoading : boolean;
    enqueteSelectLocal : EnqueteModel | null;
}

const initialState : EnqueteState = {
    enquete : null,
    enquetes : [] as EnqueteModel[],
    isError : false,
    msgError : null,
    isLoading : false,
    enqueteSelectLocal : null
}

export const EnqueteStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store,
        service = inject(EnqueteService),
        toastr = inject(ToastrService)
    ) =>({
        async getAllEnquete(){
            patchState(store,{isLoading:true,isError:false});
            try{
                const list_enquete = await firstValueFrom(service.getAll());
                patchState(store,{isLoading : false, enquetes:list_enquete});
            }catch(err:any){
                const errorMessage = err?.detail;
                patchState(store,{isLoading:false, isError:true, msgError:errorMessage})
                toastr.error(errorMessage, 'Erreur');
            }
        },
        async addEnquete(enquete : EnqueteModel){
            patchState(store,{isLoading:true,isError:false});
            try{
                const newEnquete = await firstValueFrom(service.create(enquete));
                patchState(store,{isLoading : false, enquetes:[newEnquete,...(store.enquetes() ?? [])]});
                toastr.success('Enquête enregistrer avec succès', 'Enregistrement OK');
            }catch(err:any){
                const errorMessage = err?.detail;
                patchState(store,{isLoading:false, isError:true, msgError:errorMessage})
                toastr.error(errorMessage, 'Erreur d\'enregistrement');
            }
        },
        selectEs(id: string){
            patchState(store,{isLoading:true,isError:false});
            const enquete = store.enquetes()?.find(e => e.id.toLocaleLowerCase() === id.toLocaleLowerCase());
            if(enquete){
                patchState(store,{isLoading:false,enqueteSelectLocal:enquete});
            }else{
                toastr.error("Aucun Enquete trouvées", 'Erreur');
                patchState(store,{isLoading:false,isError:false});
            }
        }
    }))
)