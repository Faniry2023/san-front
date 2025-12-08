import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { UtilisateurStore } from "./utilisateur";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

export interface PageState{
    page:'Accueil'|'Graphique'|'Données'|'Carte'|'Utilisateur'|'Poste'|'Acces'|'Kobo Toolbox'|'Power BI';
    loading:boolean;
}
const initialState:PageState = {
    page:"Accueil",
    loading:false
}

export const PageStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store,
        serviceStore = inject(UtilisateurStore),
        snackBar = inject(MatSnackBar)
    ) => ({
        async setPageState(page:'Accueil'|'Graphique'|'Données'|'Carte'|'Utilisateur'|'Poste'|'Acces'|'Kobo Toolbox'|'Power BI'){
            // patchState(store,{loading:true});
            // await serviceStore.Me();
            patchState(store,{loading:false,page:page});
            // if(serviceStore.isLogged()){
            //     localStorage.setItem('page',page);
            //     patchState(store,{loading:false,page:page});
            // }else{
            //     snackBar.open('Votre session est expiré, veillez vous se connecter à nouveau',
            //         'Fermer',{duration:10000}
            //     );
            //     patchState(store,{loading:false});
            // }
            
        }
    }))
)