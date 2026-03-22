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
import { Vulnerabilite } from '../../components/vulnerabilite/vulnerabilite';
import { Formulaire } from '../../test/formulaire/formulaire';
import { Accueil } from "../../components/accueil/accueil";
import { Acces } from '../../components/acces/acces';
import { AuthoriseModel } from '../../models/authorise-model';

@Component({
  selector: 'app-home',
  imports: [Header,
    MatIcon,
    KoboToolBox,
    Map,
    HomeComponents,
    Donnees,
    Graphique,
    Vulnerabilite,
    Formulaire, Accueil,Acces],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit{
  private store = inject(UtilisateurStore);
  private router = inject(Router);
  pageStore = inject(PageStore);
  pages:'Accueil'|'Graphique'|'Données'|'Carte'|'Utilisateur'|'Poste'|'Acces'|'Kobo Toolbox'|'Power BI'|'Vulnérabilité' = "Accueil";
  show = signal(false);

  async ngOnInit() {
    this.changePage('Accueil')
    // await this.store.Me();
    // const utiAuth = this.store.utiAuth()?.authorise;
    // const page = localStorage.getItem('page');
    // if(page == null){
    //   this.changePage('Accueil');
    // }
    // else{
    //   if(this.store.utiAuth()?.utilisateur.isAdmin){
    //     this.changePage(
    //       (page=='Graphique')?'Graphique':((page=='Données')?'Données':(((page=='Carte')?'Carte':((page=='Utilisateur')?'Utilisateur':((page=='Acces')?'Acces':((page=='Kobo Toolbox')?'Kobo Toolbox':((page=='Power BI')?'Power BI':((page=='Vulnérabilité')?'Vulnérabilité':'Accueil'))))))))
    //     )
    //   }else{
    //     switch(page){
    //       case 'Graphique':
    //         this.testDernierPage(utiAuth?.graphique!,'Graphique');
    //         break;
    //       case 'Données':
    //         this.testDernierPage(utiAuth?.situation!,'Données');
    //         break;
    //       case 'Carte':
    //         this.testDernierPage(utiAuth?.carte!,'Carte');
    //         break;
    //       case 'Utilisateur':
    //         this.testDernierPage(utiAuth?.utilisateur!,'Utilisateur');
    //         break;
    //       case 'Acces':
    //         this.testDernierPage(utiAuth?.acces!,'Acces');
    //         break;
    //       case 'Kobo Toolbox':
    //         this.testDernierPage(utiAuth?.kobo!,'Kobo Toolbox');
    //         break;
    //       case 'Power BI':
    //         this.testDernierPage(utiAuth?.powerBi!,'Power BI');
    //         break;
    //       case 'Vulnérabilité' :
    //         this.testDernierPage(utiAuth?.vulnerabilite!,'Vulnérabilité');
    //         break;
    //       default:
    //         this.changePage('Accueil');
    //     }
    //   }
    // }
  }
  
  async logout(){
    await this.store.Logout();
    this.router.navigate(['login'],
      { replaceUrl: true }
    );
  }
  
  setPage(page:'Accueil'|'Graphique'|'Données'|'Carte'|'Utilisateur'|'Acces'|'Kobo Toolbox'|'Power BI'|'Vulnérabilité'){
    const authoriseTest = this.store.utiAuth()?.authorise;
    const dernierPage = localStorage.getItem('page');
    if(!this.store.utiAuth()?.utilisateur.isAdmin){
      var isOk = false;
      switch(page){
        case 'Graphique':
          isOk = authoriseTest?.graphique!;
          break;
        case 'Données':
          isOk = authoriseTest?.situation!;
          break;
        case 'Carte':
          isOk = authoriseTest?.carte!;
          break;
        case 'Utilisateur':
          isOk = authoriseTest?.utilisateur!;
          break;
        case 'Acces':
          isOk = authoriseTest?.acces!;
          break;
        case 'Kobo Toolbox':
          isOk = authoriseTest?.kobo!;
          break;
        case 'Power BI':
          isOk = authoriseTest?.powerBi!;
          break;
        case 'Vulnérabilité':
          isOk = authoriseTest?.vulnerabilite!;
          break;
        default:
          this.changePage('Accueil');
            break;
      }
      if(isOk || page === 'Accueil'){
        this.changePage(page);
      }else{
        alert('dédolé, vous n\'êtes pas autorisé à acceder à cette menu');
      }
    }else{
      this.changePage(page);
    }
  }
  changePage(page:'Accueil'|'Graphique'|'Données'|'Carte'|'Utilisateur'|'Poste'|'Acces'|'Kobo Toolbox'|'Power BI'|'Vulnérabilité'){
    this.pageStore.setPageState(page);
    localStorage.setItem('page',page);
    this.show.set(false);
  }
  testDernierPage(auth:boolean,page:'Accueil'|'Graphique'|'Données'|'Carte'|'Utilisateur'|'Poste'|'Acces'|'Kobo Toolbox'|'Power BI'|'Vulnérabilité'){
    if(auth){
      this.changePage(page);
    }else{
      this.changePage('Accueil');
    }
  }
  showMenu(){
    this.show.set(!this.show());
  }
}
