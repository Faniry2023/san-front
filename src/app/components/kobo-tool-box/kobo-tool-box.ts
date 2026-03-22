import { Component, inject, OnInit, signal } from '@angular/core';
import { KoboToolboxStore } from '../../store/kobo.store';
import { isReponseKoboModel } from '../../guards/isReponseKoboModel';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { InfoSynch } from '../kobo/info-synch/info-synch';
import { RetoureKoboFormulaireHelper } from '../../helper/retoure-kobo-formulaire-helper';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FormulaireKoboModel } from '../../models/formulaire-kobo-model';
import { TableDonnes } from '../kobo/table-donnes/table-donnes';
import { ReponseForViewHelper } from '../../helper/reponse-for-view-helper';
import { LoadingData } from '../kobo/loading-data/loading-data';
import { Add } from './add/add';
import { UtilisateurStore } from '../../store/utilisateur';

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
  loadDel = signal(false);
  synchronisation = signal("null");
  showTable = signal(false);
  utilisateurStore = inject(UtilisateurStore)
  reloadToken = 0;
  private dialogRef?:MatDialogRef<LoadingData>;
  async ngOnInit(): Promise<void> {
    // await this.koboStore.dataViewForOneForm();
    // if(!this.koboStore.isError){
    //   console.log(this.koboStore.reponseForViewH);
    // }
    await this.utilisateurStore.Me();
    await this.koboStore.testApi();
    if(this.koboStore.apiOk()){
      this.recProj();
    }
    else{
      await this.utilisateurStore.Me();
      this.openApiAdd(this.utilisateurStore.utiAuth()?.utilisateur.id!);
    }
  }
  async deleteApi(){
    this.openLoading();
    this.loadDel.set(true)
    await this.koboStore.delete();
    if(this.koboStore.deleteOk()){
      this.koboStore.videProjet();
      this.loadDel.set(false);
      this.openApiAdd(this.utilisateurStore.utiAuth()?.utilisateur.id!);
      if(!this.loadDel()){
        this.dialogRef?.close();
      }
    }
    this.loadDel.set(false);
  }
  async onLineSyncData(){
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
  async recProj(){
    if(this.synchronisation() === "null"){
      await this.onLineSyncData();
    }else{
      this.openLoading();
      await this.koboStore.SynchroOneForm(this.synchronisation());
      await this.onLineSyncData();
      if(this.koboStore.isSynch() && !this.koboStore.loading_data()){
        this.dialogRef?.close();
      }
    }
  }
  ajoutApi(){
    this.openApiAdd(this.utilisateurStore.utiAuth()?.utilisateur.id!)
  }
  changeData(data:string,uid:string){
    this.synchronisation()
    this.reloadToken++;
    this.uidSelected.set(uid);
    this.showTable.set(true);
    this.menu.set(data);
    this.synchronisation.set(uid);
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
openApiAdd(id:string){
    this.dialog.open(Add,{
      width:'1200px',
      maxWidth:'200vw',
      height:'30%',
      disableClose:true,
      exitAnimationDuration:'300ms',
      enterAnimationDuration:'100ms',
      data:{
        'id_utilisateur':id,
      }
    })
  }
  openLoading(){
    this.dialogRef = this.dialog.open(LoadingData,{
      width:'1%',
      disableClose:true,
      exitAnimationDuration:'10ms',
      enterAnimationDuration:'100ms'
    })
  }
}