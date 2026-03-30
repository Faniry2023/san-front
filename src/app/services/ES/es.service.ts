import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ESModel } from '../../models/esmodel';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EsService {
  // private baseUrl = "https://localhost:7008/";
    private baseUrl = "https://san-back.runasp.net/";
  private httpClient = inject(HttpClient);

  create(model:ESModel):Observable<ESModel>{
    return this.httpClient.post<ESModel>(this.baseUrl + 'es/create', model,{withCredentials:true}).pipe(catchError(this.handleError));
  }

  getAll():Observable<ESModel[]>{
    return this.httpClient.get<ESModel[]>(this.baseUrl + 'es/getall',{withCredentials:true})
        .pipe(catchError(this.handleError));
  }
  getById(id:string):Observable<ESModel>{
      return this.httpClient.get<ESModel>(this.baseUrl + 'es/getbyid/' + id,{withCredentials:true})
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
