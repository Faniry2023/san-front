import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { Gadm } from "../models/gadm";
import { inject } from "@angular/core";
import { GadmService } from "../services/gadm/gadm.service";
import { ToastrService } from "ngx-toastr";
import { firstValueFrom } from "rxjs";

export interface GadmState{
    provinces : Gadm[] | null;
    regions : Gadm[] | null;
    districts : Gadm[] | null;
    communes : Gadm[] | null;
    isLoading : boolean;
    isError : boolean;
    errorMsg : string | null;
    oneSelect : Gadm | null;
}

const initialState:GadmState = {
    provinces : [] as Gadm[],
    regions : [] as Gadm[],
    districts : [] as Gadm[],
    communes : [] as Gadm[],
    isLoading : false,
    isError : false,
    errorMsg : null,
    oneSelect : null,
}

export const GadmStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store,
        service = inject(GadmService),
        toastr = inject(ToastrService)
    ) => ({
        async getGadm(){
            patchState(store, {isLoading : true, isError : false});
            try{
                const listgadm = await firstValueFrom(service.GetGadm());
                patchState(store,{isLoading : false, provinces : listgadm.provinces, regions : listgadm.regions, districts : listgadm.districts, communes : listgadm.communes});
            }catch(err:any){
                const errorMessage = err?.detail;
                patchState(store, {isLoading : false, isError : true, errorMsg : errorMessage});
                toastr.error(errorMessage, 'Erreur');
            }
        },
        async selectGadm(id:string){
            patchState(store, {isLoading : true, isError : false});
            try{
                var taille = id.split('.').length;
                var oneSle = null;
                switch(taille){
                    case 2:
                        oneSle = await store.provinces()?.find(g => g.id == id);
                        break;
                    case 3 :
                        oneSle = await store.regions()?.find(g => g.id == id);
                        break;
                    case 4 :
                        oneSle = await store.districts()?.find(g => g.id == id);
                        break;
                    case 5 :
                        oneSle = await store.communes()?.find(g => g.id == id);
                        break;
                }
                var one = await store.provinces()?.find(g => g.id == id);
                patchState(store,{isLoading : false, oneSelect:oneSle});
            }catch(err:any){
                const errorMessage = err?.detail;
                patchState(store, {isLoading : false, isError : true, errorMsg : errorMessage});
                toastr.error(errorMessage, 'Erreur');
            }
        },
    }))
)