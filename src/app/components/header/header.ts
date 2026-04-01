import { Component, inject, OnInit, Renderer2, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { UtilisateurStore } from '../../store/utilisateur';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UpdateAccount } from './update-account/update-account';

@Component({
  selector: 'app-header',
  imports: [MatIcon],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit{
  utilisateurAuth = inject(UtilisateurStore);
  dialog = inject(MatDialog);
  async ngOnInit() {
    await this.utilisateurAuth.Me();
    this.generateTheme();
  }
  showMenu = signal(false);
  private renderer = inject(Renderer2);
  store = inject(UtilisateurStore);
  private router = inject(Router);

  generateTheme(){
    const themeClasse = 'dark-theme';
    this.renderer.setAttribute(document.body,'class',themeClasse);
  }

  async logout(){
    await this.store.Logout();
    if(!this.store.isLogged() && !this.store.isError()){
      this.router.navigate(['/login'],{replaceUrl:true});
    }
  }
  
  btnMenu(){
    this.showMenu.set(!this.showMenu());
    // console.log('show menu : ' + this.showMenu())
  }
  openupdate(){
    this.showMenu.set(false);
    this.dialog.open(UpdateAccount,{
      width:'50%',
      height:'75%',
      disableClose:true,
      exitAnimationDuration:'10ms',
      enterAnimationDuration:'100ms'
    })
  }
}
