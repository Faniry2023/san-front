import { Component, inject, Input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { KoboToolboxStore } from '../../../store/kobo.store';
import { KeyValuePipe } from '@angular/common';
import { ReponseForViewHelper } from '../../../helper/reponse-for-view-helper';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoadingData } from '../loading-data/loading-data';
@Component({
  selector: 'app-table-donnes',
  imports: [KeyValuePipe],
  templateUrl: './table-donnes.html',
  styleUrl: './table-donnes.css',
})
export class TableDonnes implements OnInit,OnChanges{
  koboStore = inject(KoboToolboxStore);
  soummissionHelper!:Record<number,number>;
  repForViw:ReponseForViewHelper | null = null;
  private dialog = inject(MatDialog);
  private dialogRef?:MatDialogRef<LoadingData>;
  @Input() reloadToken!:number;
  test = signal(0);
  @Input() uid!:string;
  async ngOnInit(): Promise<void> {
    await this.chargeData();
  }
  async ngOnChanges(changes: SimpleChanges) {
    if(changes['reloadToken']){
      this.openDialog();
      await this.chargeData();
      if(!this.koboStore.loading_data()){
        this.dialogRef?.close();
      }
    }
  }
  //generation d'un boucle pour la vue
  range(n:number):number[]{
    return Array.from({length:n},(_,i) => i);
  }
  async chargeData(){
    await this.koboStore.dataViewForOneForm(this.uid);
    // console.log(this.koboStore.reponseForViewH())
    // console.log(this.koboStore.reponseForViewH()?.Reponse_soumi.length);
    this.repForViw = this.koboStore.reponseForViewH();
    this.test.set(this.koboStore.reponseForViewH()!.reponse_soumi?.length)
  }
  openDialog(){
    this.dialogRef = this.dialog.open(LoadingData,{
      width:'1%',
      disableClose:true,
      exitAnimationDuration:'10ms',
      enterAnimationDuration:'100ms'
    })
  }
}
