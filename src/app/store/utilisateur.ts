import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { UtilisateurModel } from "../models/utilisateur-model";
import { inject } from "@angular/core";
import { LogCreateService } from "../services/log_create/log-create.service";
import { LoginModel } from "../models/login-model";
import { firstValueFrom } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { UtilisateurHelper } from "../helper/utilisateur-helper";
import { LoginHelper } from "../helper/login-helper";
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

export interface UtilisateurState{
    utilisateur:UtilisateurModel | null;
    isError:boolean;
    error:string | null;
    loading:boolean;
}

const initialState:UtilisateurState = {
    utilisateur:null,
    isError:false,
    error:null,
    loading:false,
};

export const UtilisateurStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store, 
        service = inject(LogCreateService),
        toaster = inject(ToastrService),
        snackBar = inject(MatSnackBar)
    )=>({
        async createtUtilisateur(login:LoginModel, utilisateur:UtilisateurHelper, photo:File){
            patchState(store,{loading:true, isError:false, error:null});
            try{
                const new_utilisateur = await firstValueFrom(service.create(login,utilisateur,photo));
                patchState(store,{utilisateur:new_utilisateur, loading:false});
                toaster.success("Utilisateur créé avec succès","Succès");
            }catch(err:any){
                const msrError = err?.detail;
                patchState(store,{error:msrError, loading:false, isError:true});
                toaster.error(msrError ?? "Une erreur est survenue","Erreur");
            }
        },
        async LoginUtilisateur(log:LoginHelper){
            patchState(store,{loading:true, isError:false, error:null});
            try{
                const utilisateur = await firstValueFrom(service.login(log));
                patchState(store,{utilisateur:utilisateur, loading:false});
            }catch(err:any){
                const msrError = err?.detail;
                patchState(store,{error:msrError, loading:false, isError:true});
                snackBar.open(msrError, 'Fermer', {
                    duration: 5000,
                    panelClass: 'error-snackbar'
                });
            }
        },
        async Logout(){
            patchState(store,{loading:true, isError:false, error:null});
            try{
                console.log("avant execute logout")
                await firstValueFrom(service.logout());
                patchState(store,{utilisateur:null, loading:false});
                console.log("apres execute logout")
                snackBar.open("Vous êtes déconnecter", 'Fermer', {
                    duration: 5000,
                });
            }catch(err:any){
                const msrError = err?.detail;
                patchState(store,{error:msrError, loading:false, isError:true});
                snackBar.open(msrError, 'Fermer', {
                    duration: 5000,
                    panelClass: 'error-snackbar'
                });
            }
        }
    })
    )

)