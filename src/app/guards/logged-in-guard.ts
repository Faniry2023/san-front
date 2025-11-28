import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UtilisateurStore } from '../store/utilisateur';

export const loggedInGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const store = inject(UtilisateurStore);

  await store.Me();
  if(!store.isLogged()){
    router.navigate(['/login']);
    return false;
  }
  return true;
};
