import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RetoureKoboFormulaireHelper } from '../../../helper/retoure-kobo-formulaire-helper';
import { MatButtonModule } from '@angular/material/button';
import { KoboToolboxStore } from '../../../store/kobo.store';
@Component({
  selector: 'app-info-synch',
  imports: [MatProgressSpinnerModule,MatButtonModule],
  templateUrl: './info-synch.html',
  styleUrl: './info-synch.css',
})
export class InfoSynch implements OnInit{
  constructor(private dialogRef: MatDialogRef<InfoSynch>,@Inject(MAT_DIALOG_DATA) public data:any) {}
  dialogData:any;
  retoureKoboFormulaire?:RetoureKoboFormulaireHelper;
  service:any;
  sup = signal(false);
  koboStore = inject(KoboToolboxStore);
  notDel:string[] = [];
  isOnline = signal(true);
  async ngOnInit(): Promise<void> {
    this.isOnline.set(this.data.isOnline);
    if(this.isOnline()){
      this.retoureKoboFormulaire = this.data.retoureFormulaire;
      if(!this.retoureKoboFormulaire?.isLess && !this.retoureKoboFormulaire?.alert && this.retoureKoboFormulaire?.isMore){
        this.try();
      }
    }
  }
  isDelOrNo(form:string){
    if(this.notDel.includes(form)){
      this.notDel = this.notDel.filter(v => v !== form);
    }else{
      this.notDel.push(form);
    }
    if(this.notDel.length > 0){
      console.log("Les element a supprimer : ")
      for(let i = 0; i < this.notDel.length; i++){
        console.log(this.notDel[i]);
      }
      
    }
  }
  close(){
    this.dialogRef.close();
  }
  async try(){
    if(!this.retoureKoboFormulaire) return;
    this.retoureKoboFormulaire.notDel ??= [];
    this.retoureKoboFormulaire?.notDel.push(...this.notDel);
    console.log("Les element not del dans retoureForme sont : ");
    if(this.retoureKoboFormulaire.notDel.length > 0){
      for(let i = 0; i < this.retoureKoboFormulaire.notDel.length; i++){
        console.log(this.retoureKoboFormulaire.notDel[i]);
      }
    }
    await this.koboStore.ChangeForm(this.retoureKoboFormulaire!);
    if(!this.koboStore.loading() && !this.koboStore.isError()){
      this.close();
    }
  }
  procede(){
    this.sup.set(true);
  }
}
