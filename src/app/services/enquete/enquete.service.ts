import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { EnqueteModel } from '../../models/enquete-model';

@Injectable({
  providedIn: 'root',
})
export class EnqueteService {
  // private baseUrl = "https://localhost:7008/";
  private baseUrl = "https://san-back.runasp.net/";
  private httpClient = inject(HttpClient);

  getAll():Observable<EnqueteModel[]>{
    return this.httpClient.get<EnqueteModel[]>(this.baseUrl + 'enquete/all', {withCredentials:true})
    .pipe(catchError(this.handleError));
  }

  create(model : Omit<EnqueteModel, 'id'>):Observable<EnqueteModel>{
    return this.httpClient.post<EnqueteModel>(this.baseUrl + 'enquete/add',model,{withCredentials:true})
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
