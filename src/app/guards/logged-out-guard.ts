import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UtilisateurStore } from '../store/utilisateur';

export const loggedOutGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const store = inject(UtilisateurStore);

  await store.Me();
  if(store.isLogged()){
    router.navigate(['home']);
    return false;
  }
  return true;
};
