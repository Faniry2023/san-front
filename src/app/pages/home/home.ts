import { Component, inject, OnInit, signal } from '@angular/core';
import { UtilisateurStore } from '../../store/utilisateur';
import { Router } from '@angular/router';
import { Header } from '../../components/header/header';
import { MatIcon } from '@angular/material/icon';
import { KoboToolBox } from '../../components/kobo-tool-box/kobo-tool-box';
import { PageStore } from '../../store/page.store';
import { Map } from '../../components/map/map';
import { HomeComponents } from '../../components/home-components/home-components';
import { Donnees } from '../../components/donnees/donnees';
import { Graphique } from '../../components/graphique/graphique';

@Component({
  selector: 'app-home',
  imports: [Header, 
    MatIcon, 
    KoboToolBox,
    Map,
    HomeComponents,
    Donnees,
    Graphique],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit{
  private store = inject(UtilisateurStore);
  private router = inject(Router);
  pageStore = inject(PageStore);
  pages:'Accueil'|'Graphique'|'Données'|'Carte'|'Utilisateur'|'Poste'|'Acces'|'Kobo Toolbox'|'Power BI' = "Accueil";
  show = signal(false);

  ngOnInit(): void {
    const page = localStorage.getItem('page');
    if(page == null){
      this.pageStore.setPageState('Accueil');
    }
    else{
      switch(page){
        case 'Graphique':
          this.pageStore.setPageState('Graphique');
          break;
        case 'Données':
          this.pageStore.setPageState('Données');
          break;
        case 'Carte':
          this.pageStore.setPageState('Carte');
          break;
        case 'Utilisateur':
          this.pageStore.setPageState('Utilisateur');
          break;
        case 'Poste':
          this.pageStore.setPageState('Poste');
          break;
        case 'Acces':
          this.pageStore.setPageState('Acces');
          break;
        case 'Kobo Toolbox':
          this.pageStore.setPageState('Kobo Toolbox');
          break;
        case 'Power BI':
          this.pageStore.setPageState('Power BI');
          break;
        default:
          this.pageStore.setPageState('Accueil');
      }
    }
  }
  
  async logout(){
    await this.store.Logout();
    this.router.navigate(['login'],
      { replaceUrl: true }
    );
  }
  
  setPage(page:'Accueil'|'Graphique'|'Données'|'Carte'|'Utilisateur'|'Poste'|'Acces'|'Kobo Toolbox'|'Power BI'){
    this.pageStore.setPageState(page);
    localStorage.setItem('page',page);
    this.show.set(false);
  }
  showMenu(){
    this.show.set(!this.show());
  }
}
