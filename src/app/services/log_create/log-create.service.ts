import { inject, Injectable, signal } from '@angular/core';
import { LoginModel } from '../../models/login-model';
import { UtilisateurModel } from '../../models/utilisateur-model';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UtilisateurHelper } from '../../helper/utilisateur-helper';
import { LoginHelper } from '../../helper/login-helper';
import { Gadm } from '../../models/gadm';

@Injectable({
  providedIn: 'root',
})
export class LogCreateService {
  private httpClient = inject(HttpClient);
  private baseUrl = "https://localhost:7008/";

  //se connecter
  public login(log:LoginHelper):Observable<UtilisateurModel>{
    return this.httpClient.post<UtilisateurModel>(this.baseUrl + 'login', log,{withCredentials:true}).pipe(catchError(this.handleError));
  }


  //creation utilisateur avec son login
  public create(login:LoginModel, utilisateur:UtilisateurHelper, photo:File):Observable<UtilisateurModel>{
    const formData = new FormData();
    formData.append("login", JSON.stringify(login));
    formData.append("utilisateur", JSON.stringify(utilisateur));
    formData.append("photo", photo);
    return this.httpClient.post<UtilisateurModel>(this.baseUrl + 'sigin', formData,{withCredentials:true})
    .pipe(catchError(this.handleError));
  }

  public me():Observable<UtilisateurModel>{
    return this.httpClient.get<UtilisateurModel>(this.baseUrl + 'me',{withCredentials:true})
    .pipe(catchError(this.handleError));
  }

  public logout():Observable<void>{
    return this.httpClient.post<void>(this.baseUrl + 'logout',{},{withCredentials:true})
    .pipe(catchError(this.handleError));
  }

  insertGadm(gadm:Gadm):Observable<void>{
    return this.httpClient.post<void>(this.baseUrl + 'insert/gadm', gadm,{withCredentials:true}).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error?.title && error.error?.detail) {
      // Erreur ProblemDetails (provenant de .NET 8)
      return throwError(() => ({
        status: error.status,
        title: error.error.title,
        detail: error.error.detail
      }));
    }
    // Erreur générique
    return throwError(() => ({
      status: error.status,
      title: "Erreur inconnue",
      detail: "Une erreur inattendue est survenue."
    }));
  }
}
