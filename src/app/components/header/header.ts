import { Component, inject, OnInit, Renderer2, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  imports: [MatIcon],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit{
  ngOnInit(): void {
    this.generateTheme();
  }
  showMenu = signal(false);
  private renderer = inject(Renderer2);
  generateTheme(){
    const themeClasse = 'dark-theme';
    this.renderer.setAttribute(document.body,'class',themeClasse);
  }
  
  btnMenu(){
    this.showMenu.set(!this.showMenu());
    console.log('show menu : ' + this.showMenu())
  }
}
