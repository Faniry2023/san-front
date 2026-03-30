import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GadmHelper } from '../../helper/gadm-helper';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GadmService {
  // private baseUrl = "https://localhost:7008/";
    private baseUrl = "https://san-back.runasp.net/";
  private httpClient = inject(HttpClient);

  public GetGadm():Observable<GadmHelper>{
    return this.httpClient.get<GadmHelper>(this.baseUrl + 'gadm/getGadm')
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
