import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { UtilisateurModel } from "../models/utilisateur-model";
import { inject } from "@angular/core";
import { LogCreateService } from "../services/log_create/log-create.service";
import { LoginModel } from "../models/login-model";
import { firstValueFrom } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { UtilisateurHelper } from "../helper/utilisateur-helper";
import { LoginHelper } from "../helper/login-helper";
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from "@angular/router";

export interface UtilisateurState{
    utilisateur:UtilisateurModel | null;
    isError:boolean;
    error:string | null;
    errorTitle:string | null;
    loading:boolean;
    isLogged:boolean;
    errogLogin:boolean;
}

const initialState:UtilisateurState = {
    utilisateur:null,
    isError:false,
    error:null,
    errorTitle:null,
    loading:false,
    isLogged:false,
    errogLogin:false
};

export const UtilisateurStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withComputed((store) =>({
        isLoggedIn:()=>store.isLogged,
    })),
    withMethods((store, 
        service = inject(LogCreateService),
        toaster = inject(ToastrService),
        snackBar = inject(MatSnackBar),
        router = inject(Router)
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
            patchState(store,{loading:true, isError:false, errogLogin:false, error:null});
            try{
                const utilisateur = await firstValueFrom(service.login(log));
                patchState(store,{utilisateur:utilisateur, loading:false, isLogged:true});
            }catch(err:any){
                const msrError = err?.detail;
                const msgErrorTitle = err?.title;
                const erreurs = ["Utilisateur introuvable","Echec de l'authentification"];
                patchState(store,{error:msrError, loading:false,errogLogin:true, errorTitle:msgErrorTitle, isError:true});
                if(!erreurs.includes(msgErrorTitle)){
                    snackBar.open(msrError, 'Fermer', {
                        duration: 5000,
                        panelClass: 'error-snackbar'
                    });
                }
            }
        },
        async Logout(){
            patchState(store,{loading:true, isError:false, error:null});
            try{
                console.log("avant execute logout")
                await firstValueFrom(service.logout());
                patchState(store,{utilisateur:null, loading:false, isLogged:false});
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
        },
        async Me(){
            patchState(store,{loading:true, isError:false, error:null});
            try{
                const utilisateur =  await firstValueFrom(service.me());
                patchState(store,{utilisateur:utilisateur, loading:false, isLogged:true});
            }catch(err:any){
                const msrError = err?.detail;
                patchState(store,{error:msrError, loading:false, isError:true, isLogged:false});
            }
        },
        async checkSession(){
            patchState(store,{loading:true});
            await this.Me();
            if(!store.isLoggedIn()){
                patchState(store,{loading:false, utilisateur:null});
                router.navigate(['/login'],{replaceUrl:true});
                    snackBar.open('Votre session est expiré, veillez vous se reconnecter à nouveau',
                        'Fermer',{duration:10000}
                    );
            }else{
                patchState(store,{loading:false});
            }
        }
    })
    )

)