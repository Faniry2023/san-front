import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY, from, Observable, switchMap } from 'rxjs';
import { UtilisateurStore } from '../store/utilisateur';

export const authInterceptor: HttpInterceptorFn = (req:HttpRequest<any>, 
  next:HttpHandlerFn):Observable<HttpEvent<any>> => {
    const router = inject(Router);
    const store = inject(UtilisateurStore);

    if(req.url.match(/\/(login|siging|register|me)$/)){
      return next(req);
    }

    if(store.utilisateur()){
      return next(req);
    }

    return from(store.Me()).pipe(
      switchMap(() => {
        if(store.utilisateur()){
          return next(req);
        }else{
          router.navigate(['/login']);
          return EMPTY;
        }
      }),catchError(() =>{
        router.navigate(['/login']);
        return EMPTY;
      })
    )
};
