import { Component, inject, OnInit, signal } from '@angular/core';
import { UtilisateurStore } from '../../store/utilisateur';
import { Router } from '@angular/router';
import { Header } from '../../components/header/header';
import { MatIcon } from '@angular/material/icon';
import { KoboToolBox } from '../../components/kobo-tool-box/kobo-tool-box';
import { PageStore } from '../../store/page.store';
import { Map } from '../../components/map/map';

@Component({
  selector: 'app-home',
  imports: [Header, MatIcon, KoboToolBox,Map],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit{
  ngOnInit(): void {
    this.pageStore.setPageState('Accueil');
  }
  private store = inject(UtilisateurStore);
  private router = inject(Router);
  pages:'Accueil'|'Graphique'|'Données'|'Carte'|'Utilisateur'|'Poste'|'Acces'|'Kobo Toolbox'|'Power BI' = "Accueil";
  pageStore = inject(PageStore);
  show = signal(false);
  async logout(){
    await this.store.Logout();
    this.router.navigate(['login'],
      { replaceUrl: true }
    );
  }
  setPage(page:'Accueil'|'Graphique'|'Données'|'Carte'|'Utilisateur'|'Poste'|'Acces'|'Kobo Toolbox'|'Power BI'){
    this.pageStore.setPageState(page);
    this.show.set(false);
  }
  showMenu(){
    this.show.set(!this.show());
  }
}
