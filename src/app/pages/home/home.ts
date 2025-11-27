import { Component, inject } from '@angular/core';
import { UtilisateurStore } from '../../store/utilisateur';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private store = inject(UtilisateurStore);
  private router = inject(Router);

  async logout(){
    await this.store.Logout();
    this.router.navigate(['login'],
      { replaceUrl: true }
    );
  }
}
