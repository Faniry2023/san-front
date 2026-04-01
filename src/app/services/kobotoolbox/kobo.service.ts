import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { RetoureKoboFormulaireHelper } from '../../helper/retoure-kobo-formulaire-helper';
import { FormulaireKoboModel } from '../../models/formulaire-kobo-model';
import { ReponseForViewHelper } from '../../helper/reponse-for-view-helper';
import { NoConnexHelper } from '../../helper/no-connex-helper';
import { ApiKeyKoboModel } from '../../models/api-key-kobo-model';

@Injectable({
  providedIn: 'root',
})
export class KoboService {
  // private baseUrl = "https://localhost:7008/";
    private baseUrl = "https://san-back.runasp.net/";
  private httpClient = inject(HttpClient);

  public GelAllProjetcts():Observable<RetoureKoboFormulaireHelper | NoConnexHelper | null>{
    return this.httpClient.get<RetoureKoboFormulaireHelper | NoConnexHelper>(this.baseUrl + 'kobo/projetcts')
    .pipe(catchError(this.handleError));
  }

  public ChangeKobo(retoure:RetoureKoboFormulaireHelper):Observable<FormulaireKoboModel[]>{
    // console.log(retoure);
    return this.httpClient.post<FormulaireKoboModel[]>(this.baseUrl + "kobo/new/synchronisation",retoure)
    .pipe(catchError(this.handleError));
  }

  public repForViHelper(uid:string):Observable<ReponseForViewHelper>{
    return this.httpClient.get<ReponseForViewHelper>(this.baseUrl + 'alldata/for/one/form/'+ uid)
    .pipe(catchError(this.handleError));
  }

  public testApi():Observable<boolean>{
    return this.httpClient.get<boolean>(this.baseUrl + "test/apikey",{withCredentials:true})
    .pipe(catchError(this.handleError));
  }
  public deleteApi():Observable<boolean>{
    return this.httpClient.delete<boolean>(this.baseUrl + "kobo/delete/api",{withCredentials:true})
    .pipe(catchError(this.handleError));
  }

  public addApi(apiKey : ApiKeyKoboModel):Observable<boolean>{
    return this.httpClient.post<boolean>(this.baseUrl + "kobo/add/api",apiKey,{withCredentials:true})
    .pipe(catchError(this.handleError));
  }

  public synchOneForm(uid : string):Observable<boolean>{
    return this.httpClient.get<boolean>(this.baseUrl + "kobo/synch/one/" + uid, {withCredentials:true})
    .pipe(catchError(this.handleError));
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
