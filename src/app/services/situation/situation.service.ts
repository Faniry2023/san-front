import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SituationHelper } from '../../helper/situation-helper';
import { catchError, Observable, throwError } from 'rxjs';
import { CompletSituationHelper } from '../../helper/complet-situation-helper';
import { UpdateSituationHelper } from '../../helper/update-situation-helper';
import { ListeSituationHelper } from '../../helper/liste-situation-helper';
import { DisponibiliteHelper } from '../../helper/disponibilite-helper';

@Injectable({
  providedIn: 'root',
})
export class SituationService {
  private httpClient = inject(HttpClient);
  // private baseUrl = "https://localhost:7008/";
    private baseUrl = "https://san-back.runasp.net/";

  saveAll(liste_situation:SituationHelper[]):Observable<CompletSituationHelper[]>{
    const model : ListeSituationHelper = {
      situations : liste_situation
    }
    console.log(model);
    return this.httpClient.post<CompletSituationHelper[]>(this.baseUrl + 'situation/add', model,{withCredentials:true})
    .pipe(catchError(this.handleError));
  }

  delete(id:string):Observable<void>{
    return this.httpClient.delete<void>(this.baseUrl + 'situation/delete/' + id, {withCredentials:true})
    .pipe(catchError(this.handleError));
  }

  getAll():Observable<CompletSituationHelper[]>{
    return this.httpClient.get<CompletSituationHelper[]>(this.baseUrl + 'situation/getall', {withCredentials:true})
    .pipe(catchError(this.handleError));
  }

  update(model:UpdateSituationHelper):Observable<CompletSituationHelper>{
    return this.httpClient.put<CompletSituationHelper>(this.baseUrl + 'situation/update', model, {withCredentials:true})
    .pipe(catchError(this.handleError));
  }

  addDispo(model:DisponibiliteHelper):Observable<CompletSituationHelper>{
    return this.httpClient.post<CompletSituationHelper>(this.baseUrl + 'situation/add/disp', model,{withCredentials:true})
    .pipe(catchError(this.handleError));
  }

  updateDispo(model:DisponibiliteHelper):Observable<DisponibiliteHelper>{
    return this.httpClient.put<DisponibiliteHelper>(this.baseUrl + "situation/update/dispo", model, {withCredentials:true})
    .pipe(catchError(this.handleError));
  }

  deleteDispo(id:string):Observable<void>{
    return this.httpClient.delete<void>(this.baseUrl + "situation/delete/dispo/" + id, {withCredentials:true})
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
