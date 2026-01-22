import { Component, inject, OnInit, signal } from '@angular/core';
import { KoboToolboxStore } from '../../store/kobo.store';
import { isReponseKoboModel } from '../../guards/isReponseKoboModel';
import { MatDialog } from '@angular/material/dialog';
import { InfoSynch } from '../kobo/info-synch/info-synch';
import { RetoureKoboFormulaireHelper } from '../../helper/retoure-kobo-formulaire-helper';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FormulaireKoboModel } from '../../models/formulaire-kobo-model';
import { TableDonnes } from '../kobo/table-donnes/table-donnes';
import { ReponseForViewHelper } from '../../helper/reponse-for-view-helper';
import { LoadingData } from '../kobo/loading-data/loading-data';

@Component({
  selector: 'app-kobo-tool-box',
  imports: [MatProgressSpinner,TableDonnes],
  templateUrl: './kobo-tool-box.html',
  styleUrl: './kobo-tool-box.css',
})
export class KoboToolBox implements OnInit{
  koboStore = inject(KoboToolboxStore);
  private dialog = inject(MatDialog);
  retour?:RetoureKoboFormulaireHelper | FormulaireKoboModel[] | null;
  dataForView!:ReponseForViewHelper;
  isFormTab = signal(false);
  menu = signal("");
  uidSelected = signal("");
  showTable = signal(false);
  reloadToken = 0;
  async ngOnInit(): Promise<void> {
    // await this.koboStore.dataViewForOneForm();
    // if(!this.koboStore.isError){
    //   console.log(this.koboStore.reponseForViewH);
    // }
    await this.koboStore.getAllProject();
    if(!this.koboStore.isOnline()){
      this.openDialog(null,false)
    }
    const projects = this.koboStore.retoureProjects();
    if(!this.koboStore.isFormTab()){
      if(isReponseKoboModel(projects)){
        this.retour = projects;
        this.openDialog(this.retour);
      }
    }
  }
  changeData(data:string,uid:string){
    this.reloadToken++;
    this.uidSelected.set(uid);
    this.showTable.set(true);
    this.menu.set(data);
  }
  openDialog(retour:RetoureKoboFormulaireHelper | null, isOnline:boolean = true){
    const dialogRef = this.dialog.open(InfoSynch,{
        width:'50%',
        disableClose:true,
        exitAnimationDuration:'500ms',
        enterAnimationDuration:'500ms',
        data:{
          'retoureFormulaire':retour,
          'isOnline':isOnline,
        }
      })
  }
  test(){
    this.openDialog(null);
  }
  openDialogLoad(){
      const dialogRef = this.dialog.open(LoadingData,{
        width:'5px',
        disableClose:true,
        exitAnimationDuration:'1000ms',
        enterAnimationDuration:'300ms'
      })
    }
}