import { Component, inject, OnInit, signal } from '@angular/core';
import { GadmStore } from '../../store/gadm.store';
import { EsStore } from '../../store/es.store';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoadingData } from '../kobo/loading-data/loading-data';
import { VulnerabiliteStore } from '../../store/vulnerabilite.store';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Gadm } from '../../models/gadm';
import { ValMensuelModel } from '../../models/val-mensuel-model';
import { EnqueteModel } from '../../models/enquete-model';
import { EnqueteStore } from '../../store/enquete.store';
import { EvenementModel } from '../../models/evenement-model';
import { VulnerabiliteHelper } from '../../helper/vulnerabilite/vulnerabilite-helper';
import { TempsModel } from '../../models/temps-model';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { EsCreate } from '../dialog/es-create/es-create';
import { EnqueteCreate } from '../dialog/enquete-create/enquete-create';

@Component({
  selector: 'app-vulnerabilite',
  imports: [
    MatIcon,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinner
  ],
  templateUrl: './vulnerabilite.html',
  styleUrl: './vulnerabilite.css',
})
export class Vulnerabilite implements OnInit {

  isUpdate = signal(false);
  gadmStore = inject(GadmStore);
  esStore = inject(EsStore);
  enqueteStore = inject(EnqueteStore);
  oldVulnerabiliteHelper! : VulnerabiliteHelper;
  private dialog = inject(MatDialog);
  private dialogRef?:MatDialogRef<LoadingData>;
  vulnerabiliteStore = inject(VulnerabiliteStore);
  private fb = inject(FormBuilder);
  list_region = signal<Gadm[]>([]);
  list_district = signal<Gadm[]>([]);
  list_commune = signal<Gadm[]>([]);
  isValidOk = signal("");
  isLoadingBtn = signal(false);
  yearNow = signal(0);
  form = this.fb.group({
    'id_province' : ['',[Validators.required]],
    'id_region' : ['',[Validators.required]],
    'id_district' : ['',[Validators.required]],
    'id_commune' : ['',[Validators.required]],
    'id_enquete' : ['',[Validators.required]],
    'nom_evenement' : ['',[Validators.required]],
    'nom_val' : ['',[Validators.required]],
    'id_es' : ['',[Validators.required]],
    'annee' : [new Date().getFullYear(),[Validators.required,Validators.min(2000),Validators.max(new Date().getFullYear())]],
    'jan' : [0,[Validators.required, Validators.min(0)]],
    'fev' : [0,[Validators.required, Validators.min(0)]],
    'mar' : [0,[Validators.required, Validators.min(0)]],
    'avr' : [0,[Validators.required, Validators.min(0)]],
    'mai' : [0,[Validators.required, Validators.min(0)]],
    'jui' : [0,[Validators.required, Validators.min(0)]],
    'juil' : [0,[Validators.required, Validators.min(0)]],
    'aou' : [0,[Validators.required, Validators.min(0)]],
    'sep' : [0,[Validators.required, Validators.min(0)]],
    'oct' : [0,[Validators.required, Validators.min(0)]],
    'nov' : [0,[Validators.required, Validators.min(0)]],
    'dec' : [0,[Validators.required, Validators.min(0)]],
  })
  async ngOnInit() {
    this.yearNow.set(new Date().getFullYear())
    await this.gadmStore.getGadm();
    await this.esStore.getAllEs();
    await this.enqueteStore.getAllEnquete();
    await this.vulnerabiliteStore.getAll();
    this.form.get('id_province')!.valueChanges
    .subscribe(value => this.onSelectChangeRegion(value?.toString()!));
    this.form.get('id_region')!.valueChanges
    .subscribe(value => this.onSelectChangeDistrict(value?.toString()!));
    this.form.get('id_district')!.valueChanges
    .subscribe(value => this.onSelectChangeCommune(value?.toString()!));
  }
  async save(){
    this.test();
    if(this.form.valid){
      this.isLoadingBtn.set(true);
      this.openLoading();
      const vm : ValMensuelModel = {
        id: (this.isUpdate()) ? this.oldVulnerabiliteHelper.val_mensuel?.id! : '',
        id_temps :(this.isUpdate()) ? this.oldVulnerabiliteHelper.temps.id! : '',
        id_gadm : this.form.value.id_commune!,
        nom_val: this.form.value.nom_val!,
        id_es : this.form.value.id_es!
      }
      const em : EvenementModel ={
        id:(this.isUpdate()) ? this.oldVulnerabiliteHelper.evenement?.id! : '',
        id_enquete : this.form.value.id_enquete!,
        id_val_mens : (this.isUpdate()) ? this.oldVulnerabiliteHelper.val_mensuel?.id! : '',
        cle_principal : this.form.value.nom_evenement!,
      }
      const temps : TempsModel = {
        id: (this.isUpdate()) ? this.oldVulnerabiliteHelper.temps.id :'',
        nom_evenement : this.form.value.nom_evenement!,
        annee:this.form.value.annee!,
        jan : this.form.value.jan?.toString()!,
        fev : this.form.value.fev?.toString()!,
        mar : this.form.value.mar?.toString()!,
        avr : this.form.value.avr?.toString()!,
        mai : this.form.value.mai?.toString()!,
        jui : this.form.value.jui?.toString()!,
        juill : this.form.value.juil?.toString()!,
        aou : this.form.value.aou?.toString()!,
        sep : this.form.value.sep?.toString()!,
        oct : this.form.value.oct?.toString()!,
        nov : this.form.value.nov?.toString()!,
        dec : this.form.value.dec?.toString()!,
      }
      this.enqueteStore.selectEs(this.form.value.id_enquete!);
      this.esStore.selectEs(this.form.value.id_es!);
      await this.gadmStore.selectGadm(this.form.value.id_commune!);
      const vulnerabilite : VulnerabiliteHelper = {
        enquete : this.enqueteStore.enqueteSelectLocal(),
        evenement : em,
        val_mensuel : vm,
        relation : null,
        es : this.esStore.select_Es_Local()!,
        gadm : this.gadmStore.oneSelect(),
        temps : temps
      }
      if(this.isUpdate()){
        await this.vulnerabiliteStore.update(vulnerabilite, this.oldVulnerabiliteHelper);
        this.isUpdate.set(false);
      }else{
        await this.vulnerabiliteStore.add(vulnerabilite);
      }
      if(!this.vulnerabiliteStore.isLoading()){
        this.isLoadingBtn.set(false);
        this.dialogRef?.close();
      }
    }else{
      alert('Veillez remplir tous les champs !');
    }
  }
  cancel(){
    this.isUpdate.set(false);
  }
  async delete(vh :VulnerabiliteHelper){
    const ok = confirm("Voulez-vous vraiment supprimer cet élément ?");
    if(ok){
      this.isLoadingBtn.set(true);
      this.openLoading();
      await this.vulnerabiliteStore.delete(vh);
      if(!this.vulnerabiliteStore.isLoading()){
        this.isLoadingBtn.set(false);
        this.dialogRef?.close();
      }
    }
  }
  test(){
    if(this.form.value.id_province == null || this.form.value.id_province == null == undefined){
      this.isValidOk.set("province")
    }else{
      if(this.form.value.id_region == null || this.form.value.id_region == null == undefined){
        this.isValidOk.set("region")
      }else{
        if(this.form.value.id_district == null || this.form.value.id_district == null == undefined){
          this.isValidOk.set("district")
        }else{
          if(this.form.value.id_commune == null || this.form.value.id_commune == null == undefined){
          this.isValidOk.set("commune")
          }else{
            this.isValidOk.set("");
          }
        }
      }
    }
  }
  onSelectChangeRegion(value : string){
    if(value.length > 1){
      this.initialiseGadmList();
      const select = value.substring(0, value.length - 2).toLowerCase();
      const result = this.gadmStore.regions()?.filter(g => g.id.toLowerCase().includes(select));
      this.list_region.set(result!);
      // console.log(select);
        this.form.get('id_region')?.reset();
        this.form.get('id_district')?.reset();
        this.form.get('id_commune')?.reset();
        this.form.get('fokontany')?.reset();
    }
  }
  onSelectChangeDistrict(value : string){
    if(value.length > 1){
      const select = value.substring(0, value.length - 2).toLowerCase();
      const result = this.gadmStore.districts()?.filter(g => g.id.toLowerCase().includes(select));
      this.list_district.set(result!);
      this.form.get('id_district')?.reset();
      this.form.get('id_commune')?.reset();
      this.form.get('fokontany')?.reset();
    }
  }
  onSelectChangeCommune(value : string){
    if(value.length > 1){
      this.list_commune.set([]);
      const select = value.substring(0, value.length - 2).toLowerCase();
      const result = this.gadmStore.communes()?.filter(g => g.id.toLowerCase().includes(select));
      this.list_commune.set(result!);
      this.form.get('id_commune')?.reset();
      this.form.get('fokontany')?.reset();
    }
  }
  initialiseGadmList(){
    this.list_region.set([]);
    this.list_district.set([]);
    this.list_commune.set([]);
  }
  openLoading(){
    this.dialogRef = this.dialog.open(LoadingData,{
      width:'1%',
      disableClose:true,
      exitAnimationDuration:'10ms',
      enterAnimationDuration:'100ms'
    })
  }
  openDialogEs(){
    this.dialog.open(EsCreate,{
      width:'50%',
      height:'90%',
      disableClose:true,
      exitAnimationDuration:'300ms',
      enterAnimationDuration:'100ms'
    })
  }
  openDialogEnquete(){
    this.dialog.open(EnqueteCreate,{
      width:'50%',
      height:'40%',
      disableClose:true,
      exitAnimationDuration:'300ms',
      enterAnimationDuration:'100ms'
    })
  }
  update(vulnerabilite : VulnerabiliteHelper){
    this.isUpdate.set(true);
    this.oldVulnerabiliteHelper = vulnerabilite;
    this.form.get('nom_evenement')?.setValue(vulnerabilite.evenement?.cle_principal!);
    this.form.get('nom_val')?.setValue(vulnerabilite.val_mensuel?.nom_val!);
    this.form.get('id_enquete')?.setValue(vulnerabilite.evenement?.id_enquete.toLowerCase()!);
    this.form.get('id_es')?.setValue(vulnerabilite.es.id);
    this.form.get('annee')?.setValue(vulnerabilite.temps.annee);
    this.form.get('jan')?.setValue(Number(vulnerabilite.temps.jan));
    this.form.get('fev')?.setValue(Number(vulnerabilite.temps.fev));
    this.form.get('mar')?.setValue(Number(vulnerabilite.temps.mar));
    this.form.get('avr')?.setValue(Number(vulnerabilite.temps.avr));
    this.form.get('mai')?.setValue(Number(vulnerabilite.temps.mai));
    this.form.get('jui')?.setValue(Number(vulnerabilite.temps.jui));
    this.form.get('juil')?.setValue(Number(vulnerabilite.temps.juill));
    this.form.get('aou')?.setValue(Number(vulnerabilite.temps.aou));
    this.form.get('sep')?.setValue(Number(vulnerabilite.temps.sep));
    this.form.get('oct')?.setValue(Number(vulnerabilite.temps.oct));
    this.form.get('nov')?.setValue(Number(vulnerabilite.temps.nov));
    this.form.get('dec')?.setValue(Number(vulnerabilite.temps.dec));
    this.selectGadm(vulnerabilite.gadm?.id!);
  }
  selectGadm(id:string){
    const idSep = id.split('.');
    const id_province = idSep[0] + "." + idSep[1] + "_1";
    const id_region = idSep[0] + "." + idSep[1] + "." + idSep[2] + "_1";
    const district = idSep[0] + "." + idSep[1] + "." + idSep[2] + "." + idSep[3] +  "_1";
    this.onSelectChangeRegion(id_province);
    this.form.get('id_province')?.setValue(id_province);
    this.onSelectChangeDistrict(id_region);
    this.form.get('id_region')?.setValue(id_region);
    this.onSelectChangeCommune(district);
    this.form.get('id_district')?.setValue(district);
    this.form.get('id_commune')?.setValue(id);
  }
}
