import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { GadmStore } from '../../store/gadm.store';
import { Gadm } from '../../models/gadm';
import { UtilisateurStore } from '../../store/utilisateur';
import { AuthoriseModel } from '../../models/authorise-model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoadingData } from '../kobo/loading-data/loading-data';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { use } from 'echarts';
import { UtilisateurAuthoriseHelper } from '../../helper/utilisateur-authorise-helper';

@Component({
  selector: 'app-acces',
  imports: [FormsModule,ReactiveFormsModule,MatCheckboxModule,LoadingData,MatProgressSpinner],
  templateUrl: './acces.html',
  styleUrl: './acces.css',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class Acces implements OnInit{
  private readonly fb = inject(FormBuilder);
  graphique = signal(false);
  gadmStore = inject(GadmStore);
  private dialogRef?:MatDialogRef<LoadingData>;
  private dialog = inject(MatDialog);
  authorisation_select = signal<AuthoriseModel | null>(null);
  liste_region = signal<Gadm[]>([]);
  liste_district = signal<Gadm[]>([]);
  liste_commune = signal<Gadm[]>([]);
  recherche = signal<string>('');
  liste_utilisateur = signal<UtilisateurAuthoriseHelper[]>([]);
  select_utilisateur = signal("");
  utilisateurStore = inject(UtilisateurStore);
  nv = signal<number>(0);
  form = this.fb.group({
    graphique:false,
    situation:false,
    vulnerabilite:false,
    carte:false,
    utilisateur:false,
    acces:false,
    kobo:false,
    power:false,
    nv:['',[Validators.required]],
    id_pro:[''],
    id_reg:[''],
    id_dis:[''],
    id_com:[''],
  })
  constructor(){
    effect(() =>{
      const utilisateurs = this.utilisateurStore.listeUtilisateur();
      const filter_utilisateur = utilisateurs!.filter(usr => usr.utilisateur.nom.toLowerCase().includes(this.recherche()) || 
      usr.utilisateur.prenom.toLowerCase().includes(this.recherche()));
      this.liste_utilisateur.set(filter_utilisateur);
    });
  }
  async ngOnInit(){
    this.openLoading();
    await this.utilisateurStore.getAll();
    await this.gadmStore.getGadm();
    this.form.get('nv')?.valueChanges.subscribe(value =>
      this.onSelectChangeNiv(value?.toString()!));
    this.form.get('id_pro')?.valueChanges
    .subscribe(value => this.onSelectChangeRegion(value?.toString()!));
    this.form.get('id_reg')?.valueChanges
    .subscribe(value => this.onSelectChangeDistrict(value?.toString()!));
    this.form.get('id_dis')?.valueChanges
    .subscribe(value => this.onSelectChangeCommune(value?.toString()!));
    if(!this.utilisateurStore.loading() && !this.gadmStore.isLoading()){
      this.dialogRef?.close()
    }
  }
  async save(){
    if(this.form.valid && this.testValidGadm(this.nv())){
      const id_pro = this.form.value.id_pro;
      const id_reg = this.form.value.id_reg;
      const id_dis = this.form.value.id_dis;
      const id_com = this.form.value.id_com;
      const authorise : AuthoriseModel = {
        id:this.authorisation_select()?.id!,
        id_utilisateur:this.utilisateurStore.one_user()?.utilisateur.id!,
        graphique:this.form.value.graphique!,
        situation:this.form.value.situation!,
        vulnerabilite:this.form.value.vulnerabilite!,
        carte:this.form.value.carte!,
        utilisateur:this.form.value.utilisateur!,
        acces:this.form.value.acces!,
        kobo:this.form.value.kobo!,
        powerBi:this.form.value.power!,
        gadm:this.nv() == 1 ? id_pro! : (this.nv() == 2 ? id_reg : (this.nv() == 3 ? id_dis : (this.nv() == 4 ? id_com : 'aucun')))!
      }
      await this.utilisateurStore.addAuthorize(authorise);
    }
  }
  openLoading(){
    this.dialogRef = this.dialog.open(LoadingData,{
      width:'1%',
      disableClose:true,
      exitAnimationDuration:'10ms',
      enterAnimationDuration:'100ms'
    })
  }
  async select_user(id:string){
    
    await this.utilisateurStore.select_one(id);
    this.select_utilisateur.set(id);
    if(this.utilisateurStore.one_user()?.utilisateur.isAdmin){
      this.form.disable();
    }else{
      
      this.form.enable();
      const autorisation = this.utilisateurStore.one_user()?.authorise;
      console.log(autorisation)
      this.form.get('graphique')?.setValue(autorisation?.graphique!);
      this.form.get('situation')?.setValue(autorisation?.situation!);
      this.form.get('vulnerabilite')?.setValue(autorisation?.vulnerabilite!);
      this.form.get('carte')?.setValue(autorisation?.carte!);
      this.form.get('utilisateur')?.setValue(autorisation?.utilisateur!);
      this.form.get('acces')?.setValue(autorisation?.acces!);
      this.form.get('kobo')?.setValue(autorisation?.kobo!);
      this.form.get('power')?.setValue(autorisation?.powerBi!);
      if(autorisation?.gadm != "aucun"){
        await this.gadmStore.selectGadm(autorisation?.gadm!);
        const gadm_selec = this.gadmStore.oneSelect();
        console.log('gadm select : ')
        console.log(gadm_selec)
        this.nv.set(gadm_selec?.level!);
        this.form.get('nv')?.setValue(this.nv().toString());
        switch(this.nv()){
          case 1:
            this.nv.set(1);
            this.selectGadm(1,this.gadmStore.oneSelect()?.id!);
            break;
          case 2:
            this.nv.set(2);
            this.selectGadm(2,this.gadmStore.oneSelect()?.id!);
            break;
          case 3:
            this.nv.set(3);
            this.selectGadm(3,this.gadmStore.oneSelect()?.id!);
            break;
          case 4:
            this.nv.set(4);
            this.selectGadm(4,this.gadmStore.oneSelect()?.id!);
            break;
          default:
            this.nv.set(1);
            this.selectGadm(1,this.gadmStore.oneSelect()?.id!);
        }
      }
      else{
        this.form.get('nv')?.setValue(this.nv().toString());
      }
      this.authorisation_select.set(autorisation!);
    }
  }
    selectGadm(niv:number, id:string){
    if(niv > 1){
      const idSep = id.split('.');
      const id_province = idSep[0] + "." + idSep[1] + "_1";
      this.onSelectChangeRegion(id_province);
      this.form.get('id_pro')?.setValue(id_province);
      if(niv > 2){
        const id_region = idSep[0] + "." + idSep[1] + "." + idSep[2] + "_1";
        this.onSelectChangeDistrict(id_region);
        this.form.get('id_reg')?.setValue(id_region);
        if(niv > 3){
          const district = idSep[0] + "." + idSep[1] + "." + idSep[2] + "." + idSep[3] + "_1";
        
          this.onSelectChangeCommune(district);
          this.form.get('id_dis')?.setValue(district);
          this.form.get('id_com')?.setValue(id);
        }else{
          this.form.get('id_dis')?.setValue(id);
        }
      }else{
        this.form.get('id_reg')?.setValue(id);
      }
      
    }else{
      this.form.get('id_pro')?.setValue(id);
    }
  }
  onSelectChangeNiv(value : string){
    const newNv = Number(value);
    console.log(value);
    this.nv.set(newNv);
    console.log(this.nv());

    this.form.get('id_pro')?.reset();
    this.form.get('id_reg')?.reset();
    this.form.get('id_dis')?.reset();
    this.form.get('id_com')?.reset();
    this.form.get('foko')?.reset();
  }
  testValidGadm(nv:number):boolean{
    const id_pro = this.form.value.id_pro;
    const id_reg = this.form.value.id_reg;
    const id_dis = this.form.value.id_dis;
    const id_com = this.form.value.id_com;
    if(nv >= 1){
      if(id_pro == undefined || id_pro == null){
        alert('option selection de province manquant')
        return false;
      }
      if(nv >= 2){
        if(id_reg == undefined || id_reg == null){
          alert('option selection de région manquant')
          return false;
        }
        if(nv >= 3){
          if(id_dis == undefined || id_dis == null){
            alert('option selection de district manquant')
            return false;
          }
          if(nv >= 4){
            if(id_com == undefined || id_com == null){
              alert('option selection de commune manquant')
              return false;
            }
          }
        }
      }
    }

    return true;
  }
  onSelectChangeRegion(value : string){
    if(value.length > 1){
      this.initialiseGadmList();
      const select = value.substring(0, value.length - 2).toLowerCase();
      const result = this.gadmStore.regions()?.filter(g => g.id.toLowerCase().includes(select));
      this.liste_region.set(result!);
      console.log(select);
      this.form.get('id_reg')?.reset();
      this.form.get('id_dis')?.reset();
      this.form.get('id_com')?.reset();
      this.form.get('foko')?.reset();
    }
  }
  onSelectChangeDistrict(value : string){
    if(value.length > 1){
      const select = value.substring(0, value.length - 2).toLowerCase();
      const result = this.gadmStore.districts()?.filter(g => g.id.toLowerCase().includes(select));
      this.liste_district.set(result!);
      this.form.get('id_dis')?.reset();
      this.form.get('id_com')?.reset();
      this.form.get('foko')?.reset();
    }
  }
  onSelectChangeCommune(value : string){
    if(value.length > 1){
      this.liste_commune.set([]);
      const select = value.substring(0, value.length - 2).toLowerCase();
      const result = this.gadmStore.communes()?.filter(g => g.id.toLowerCase().includes(select));
      this.liste_commune.set(result!);
      this.form.get('id_com')?.reset();
      this.form.get('foko')?.reset();
    }
  }
  initialiseGadmList(){
    this.liste_region.set([]);
    this.liste_district.set([]);
    this.liste_commune.set([]);
  }
}
