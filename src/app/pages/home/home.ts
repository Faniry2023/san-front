import { Component, inject, signal } from '@angular/core';
import { UtilisateurStore } from '../../store/utilisateur';
import { Router } from '@angular/router';
import { Header } from '../../components/header/header';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  imports: [Header,MatIcon ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private store = inject(UtilisateurStore);
  private router = inject(Router);
  show = signal(false);
  async logout(){
    await this.store.Logout();
    this.router.navigate(['login'],
      { replaceUrl: true }
    );
  }
  showMenu(){
    this.show.set(!this.show());
  }
}
