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
import { Gadm } from "../models/gadm";
import { UtilisateurAuthoriseHelper } from "../helper/utilisateur-authorise-helper";
import { AuthoriseModel } from "../models/authorise-model";

export interface UtilisateurState{
    utiAuth:UtilisateurAuthoriseHelper | null;
    listeUtilisateur:UtilisateurAuthoriseHelper[];
    one_user : UtilisateurAuthoriseHelper | null;
    isError:boolean;
    error:string | null;
    errorTitle:string | null;
    loading:boolean;
    isLogged:boolean;
    errogLogin:boolean;
    loading_authorize:boolean;
}

const initialState:UtilisateurState = {
    utiAuth:null,
    listeUtilisateur:[] as UtilisateurAuthoriseHelper[],
    one_user : null,
    isError:false,
    error:null,
    errorTitle:null,
    loading:false,
    isLogged:false,
    errogLogin:false,
    loading_authorize:false,
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
                patchState(store,{utiAuth:new_utilisateur, loading:false});
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
                patchState(store,{utiAuth:utilisateur, loading:false, isLogged:true});
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
                await firstValueFrom(service.logout());
                patchState(store,{utiAuth:null, loading:false, isLogged:false});
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
                patchState(store,{utiAuth:utilisateur, loading:false, isLogged:true});
            }catch(err:any){
                const msrError = err?.detail;
                patchState(store,{utiAuth:null,error:msrError, loading:false, isError:true, isLogged:false});
            }
        },
        async checkSession(){
            patchState(store,{loading:true});
            await this.Me();
            if(!store.isLoggedIn()){
                patchState(store,{loading:false, utiAuth:null});
                router.navigate(['/login'],{replaceUrl:true});
                    snackBar.open('Votre session est expiré, veillez vous se reconnecter à nouveau',
                        'Fermer',{duration:10000}
                    );
            }else{
                patchState(store,{loading:false});
            }
        },
        async insertGadm(gadm:Gadm){
            patchState(store,{loading:true, isError:false, error:null});
            try{
                await firstValueFrom(service.insertGadm(gadm));
                patchState(store,{loading:false, });
            }catch(err:any){
                const msrError = err?.detail;
                patchState(store,{error:msrError, loading:false, isError:true});
            }
        },
        async getAll(){
            patchState(store,{loading:true, isError:false, error:null});
            try{
                const liste_utilisateur = await firstValueFrom(service.getAllUser());
                patchState(store,{loading:false,listeUtilisateur:liste_utilisateur });
            }catch(err:any){
                const msrError = err?.detail;
                patchState(store,{error:msrError, loading:false, isError:true});
            }
        },
        async addAuthorize(model:AuthoriseModel){
            patchState(store,{loading:true, loading_authorize:true, isError:false, error:null});
            try{
                const new_authorise = await firstValueFrom(service.addAuthorise(model));
                const new_list = (store.listeUtilisateur() ?? []).map(u =>{
                    if(u.authorise && u.utilisateur.id && u.authorise.id.toLowerCase() === model.id.toLowerCase()){
                        return{
                            ...u,authorise:new_authorise
                        };
                    }
                    return u;
                })
                patchState(store,{loading:false, loading_authorize:false, listeUtilisateur:new_list });
            }catch(err:any){
                const msrError = err?.detail;
                patchState(store,{error:msrError, loading_authorize:false, loading:false, isError:true});
            }
        },

        async select_one(id:string){
            patchState(store,{loading:true, isError:false, error:null});
            const utilisateur = await store.listeUtilisateur().find(u => u.utilisateur.id.toLowerCase() === id.toLowerCase());
            if(utilisateur){
                patchState(store,{loading:false,one_user:utilisateur });
            }else{
                patchState(store,{loading:false, isError:true });
                toaster.error("Une erreur lors de récupération de cette utilisateur",'Erreur')
            }
        }
    })
    )
)