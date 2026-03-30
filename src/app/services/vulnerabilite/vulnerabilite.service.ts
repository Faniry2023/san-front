import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { VulnerabiliteHelper } from '../../helper/vulnerabilite/vulnerabilite-helper';
import { UpdateSituationHelper } from '../../helper/update-situation-helper';
import { UpdateVulnerabiliteHelper } from '../../helper/vulnerabilite/update-vulnerabilite-helper';

@Injectable({
  providedIn: 'root',
})
export class VulnerabiliteService {
  private httpClient = inject(HttpClient);
  // private baseUrl = "https://localhost:7008/";
    private baseUrl = "https://san-back.runasp.net/";
  
  getAll():Observable<VulnerabiliteHelper[]>{
    return this.httpClient.get<VulnerabiliteHelper[]>(this.baseUrl + 'vulnerabilite/all',{withCredentials:true})
    .pipe(catchError(this.handleError));
  }
  add(model : VulnerabiliteHelper):Observable<VulnerabiliteHelper>{
    return this.httpClient.post<VulnerabiliteHelper>(this.baseUrl + 'vulnerabilite/add',model,{withCredentials:true})
    .pipe(catchError(this.handleError));
  }
  update(model : UpdateVulnerabiliteHelper):Observable<VulnerabiliteHelper>{
    return this.httpClient.put<VulnerabiliteHelper>(this.baseUrl + 'vulnerabilite/update', model,{withCredentials:true})
    .pipe(catchError(this.handleError));
  }
  delete(id_evenement : string):Observable<void>{
    return this.httpClient.delete<void>(this.baseUrl + 'vulnerabilite/delete/' + id_evenement, {withCredentials:true})
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
