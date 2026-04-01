import { Component, inject, OnInit, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from "@angular/material/icon";
import { EsCreate } from '../dialog/es-create/es-create';
import { EsStore } from '../../store/es.store';
import { GadmStore } from '../../store/gadm.store';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Gadm } from '../../models/gadm';
import { EnqueteCreate } from '../dialog/enquete-create/enquete-create';
import { AddSituationStore } from '../../store/addSituation.store';
import { EnqueteStore } from '../../store/enquete.store';
import { ProduitModel } from '../../models/produit-model';
import { TempsModel } from '../../models/temps-model';
import { SituationHelper } from '../../helper/situation-helper';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { LoadingData } from '../kobo/loading-data/loading-data';
import { CompletSituationHelper } from '../../helper/complet-situation-helper';
import { UpdateSituationHelper } from '../../helper/update-situation-helper';
import { Dispo } from './dispo/dispo';

@Component({
  selector: 'app-donnees',
  imports: [
    MatIcon, 
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinner],
  templateUrl: './donnees.html',
  styleUrl: './donnees.css',
})
export class Donnees implements OnInit{
  isUpload = signal(false);
  isUpdateBd = signal(false);
  updateSituationBd : UpdateSituationHelper = {
    produit : null as any,
    temps : null as any
  };
  oldSituation! : SituationHelper;
  liste_commune = signal([]);
  esStore = inject(EsStore);
  gadmStore = inject(GadmStore);
  nv = signal<number>(1);
  private dialog = inject(MatDialog);
  private dialogRef?:MatDialogRef<LoadingData>;
  selectedValueNiveau : any;
  selectedValueProvince : any;
  selectedValueRegion : any;
  selectedValueDistrict : any;
  private fb = inject(FormBuilder);
  list_region = signal<Gadm[]>([]);
  list_district = signal<Gadm[]>([]);
  list_commune = signal<Gadm[]>([]);
  situationStore = inject(AddSituationStore);
  yearNow = signal(0);
  formValid = signal(false);
  enqueteStore = inject(EnqueteStore);
  isLoadinBD = signal(false);
  form = this.fb.group({
    'niveau' : [0,[Validators.required]],
    'id_province' : ['',[Validators.required]],
    'id_region' : [''],
    'id_district' : [''],
    'id_commune' : [''],
    'fokontany' : ['...'],
    'id_es' : ['',[Validators.required]],
    'cle' : ['',[Validators.required]],
    'id_enquete' : ['',[Validators.required]],
    'annee' : [new Date().getFullYear(),[Validators.required,Validators.min(2000),Validators.max(new Date().getFullYear())]],
    'denre' : ['',[Validators.required]],
    'unite' : ['',[Validators.required]],
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

  async addList(){
    const valeur = this.addValidator();
    // alert('add validator : ' + valeur );
    if(this.form.valid && valeur== ""){
      const id_region = this.form.value.id_region;
      const id_district = this.form.value.id_district;
      const id_commune = this.form.value.id_commune;
      const fokontany = this.form.value.fokontany;
      const id_es = this.form.value.id_es;
      const niveau = this.form.value.niveau;
      const id_province = this.form.value.id_province;
      const cle = this.form.value.cle;
      const id_enquete = this.form.value.id_enquete;
      const annee = this.form.value.annee;
      const denre = this.form.value.denre;
      const unite = this.form.value.unite;
      const jan = this.form.value.jan;
      const fev = this.form.value.fev;
      const mar = this.form.value.mar;
      const avr = this.form.value.avr;
      const mai = this.form.value.mai;
      const jui = this.form.value.jui;
      const juil = this.form.value.juil;
      const aou = this.form.value.aou;
      const sep = this.form.value.sep;
      const oct = this.form.value.oct;
      const nov = this.form.value.nov;
      const dec = this.form.value.dec;
      await this.esStore.selectEs(id_es!);
      if(this.esStore.select_Es_Local != null){
        const gadm = (this.nv()==1)? id_province : ((this.nv()==2)? id_region : ((this.nv()==3)?id_district:id_commune));
        const fkt = (this.nv()==4)?fokontany:'';
        const produit : ProduitModel = {
          id:'',
          id_temps:'',
          id_gadm:gadm!,
          id_enquete:id_enquete!,
          id_es:id_es!,
          nom_prod:denre!,
          unite:unite!,
          cle:cle!
        }
        const temps : TempsModel = {
          id:'',
          nom_evenement:'',
          annee:Number(annee),
          jan:jan?.toString()!,
          fev:fev?.toString()!,
          mar:mar?.toString()!,
          avr:avr?.toString()!,
          mai:mai?.toString()!,
          jui:jui?.toString()!,
          juill:juil?.toString()!,
          aou:aou?.toString()!,
          sep:sep?.toString()!,
          oct:oct?.toString()!,
          nov:nov?.toString()!,
          dec:dec?.toString()!,
        }
        if(this.isUpdateBd()){
          produit.id = this.updateSituationBd.produit.id;
          produit.id_temps = this.updateSituationBd.temps.id;
          temps.id = this.updateSituationBd.temps.id;
          const ush :UpdateSituationHelper = {
            produit : produit,
            temps : temps,
          }
          await this.situationStore.updateInBd(ush);
        }
        else{
          const situationHelper : SituationHelper = {
            produit:produit,
            temps:temps,
            es:this.esStore.select_Es_Local()!
          }
          if(this.isUpload()){
            await this.situationStore.update(this.oldSituation,situationHelper);
            this.isUpload.set(false);
          }
          else{
            await this.situationStore.add(situationHelper);
          }
        }
      }
    }else{
      alert('Veillez remplir tous les champs !');
    }
  }
  isValidOk = signal<string>("");
  addValidator():string{
    this.isValidOk.set("");
    const id_region = this.form.value.id_region;
    const id_district = this.form.value.id_district;
    const id_commune = this.form.value.id_commune;
    const fokontany = this.form.value.fokontany;
    const id_province = this.form.value.id_province;
    switch(this.nv()){
      case 4:
        // alert('niveau : ' + this.nv());
        if(id_province == null || id_province == undefined){
          this.isValidOk.set("province");
        }else{
          if(id_region == undefined || id_region == null){
            this.isValidOk.set("region");
          }else{
            if(id_district == undefined || id_district == null){
              this.isValidOk.set("district");
            }else{
              if(id_district == undefined || id_district == null){
                this.isValidOk.set("district");
              }
              else{
                if(id_commune == undefined ||id_commune == null){
                  this.isValidOk.set("commune");
                }else{
                  if(fokontany == undefined || fokontany == null){
                    this.isValidOk.set("fokontany");
                  }
                }
              }
            }
          }
        }
        break;
      case 3:
        // alert('niveau : ' + this.nv());
        if(id_region == undefined || id_region == null){
          this.isValidOk.set("region");
        }else{
          if(id_district == undefined || id_district == null){
            this.isValidOk.set("district");
          }
        }
        break;
      case 2:
        // alert('niveau : ' + this.nv());
        if(id_province == undefined || id_province == null){
          // alert('erreur province')
          this.isValidOk.set("province");
        }else{
          if(id_region == undefined || id_region == null){
            // alert('erreur region')
            this.isValidOk.set("region");
          }
        }
        // alert('niveau 2 test : ' + this.isValidOk())
        break;
      case 1 :
        // alert('niveau : ' + this.nv());
        if(id_province == undefined || id_province == null){
          this.isValidOk.set("province");
        }
        break
      default:
        // alert('default : ' + this.nv());
        if(id_province == undefined || id_province == null){
          this.isValidOk.set("");
        }
        break;
    }
    // alert('is valid : '+this.isValidOk() + ' et le niveau : ' + this.nv());
    return this.isValidOk();
  }
  async ngOnInit() {
    this.isLoadinBD.set(true);
    await this.situationStore.getAll();
    await this.situationStore.allInBd();
    // console.log(this.situationStore.allSituationInBd());
    if(!this.situationStore.isLoading()){
      this.isLoadinBD.set(false);
    }
    this.form.get('niveau')!
    .valueChanges
    .subscribe(value => this.onSelectChangeNiv(value?.toString()!));
    this.form.get('id_province')!
    .valueChanges
    .subscribe(value => this.onSelectChangeRegion(value!));
    this.form.get('id_region')!
    .valueChanges
    .subscribe(value => this.onSelectChangeDistrict(value!));
    this.form.get('id_district')!
    .valueChanges
    .subscribe(value => this.onSelectChangeCommune(value?.toString()!));

    await this.esStore.getAllEs();
    await this.gadmStore.getGadm();
    await this.enqueteStore.getAllEnquete();
    this.yearNow.set(new Date().getFullYear());
    // this.openDialog(); 
  }
  onSelectChangeNiv(value : string){
    const newNv = Number(value);
    console.log(value);
    this.nv.set(newNv);
    console.log(this.nv());

    this.form.get('id_region')?.reset();
    this.form.get('id_district')?.reset();
    this.form.get('id_commune')?.reset();
    this.form.get('fokontany')?.reset();
    this.form.get('id_province')?.reset();
  }

  onSelectChangeRegion(value : string){
    if(value.length > 1){
      this.initialiseGadmList();
      const select = value.substring(0, value.length - 2).toLowerCase();
      const result = this.gadmStore.regions()?.filter(g => g.id.toLowerCase().includes(select));
      this.list_region.set(result!);
      console.log(select);
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
  initialiseGadmList(){
    this.list_region.set([]);
    this.list_district.set([]);
    this.list_commune.set([]);
  }
  delete(situation:SituationHelper){
    const ok = confirm("Voulez-vous vraiment supprimer cet élément ?");
    if(ok){
      this.situationStore.delete(situation);
    }
  }
  async deleteBd(situation:CompletSituationHelper){
    const ok = confirm("Voulez-vous vraiment supprimer cet élément ?");
    if(ok){
      await this.situationStore.deleteInDb(situation);
    }
  }
  async saveAll(){
    const ok = confirm("Tous les éléments sur ce tableau seront enregistré.");
    if(ok){
      this.openLoading();
      await this.situationStore.saveAll();
      if(!this.situationStore.isLoading()){
        this.dialogRef?.close();
      }
    }
  }
  cancel(){
    this.isUpload.set(false);
    this.isUpdateBd.set(false);
  }
  openLoading(){
    this.dialogRef = this.dialog.open(LoadingData,{
      width:'1%',
      disableClose:true,
      exitAnimationDuration:'10ms',
      enterAnimationDuration:'100ms'
    })
  }
  async updateLocalStorage(situation:SituationHelper){
    this.isUpload.set(true);
    this.isUpdateBd.set(false);
    await this.update(situation);
  }
  async update(situation:SituationHelper){
    this.isUpload.set(true);
    this.oldSituation = situation;
    this.form.get('id_es')?.setValue(situation.es.id);
    this.form.get('cle')?.setValue(situation.produit.cle);
    this.form.get('id_enquete')?.setValue(situation.produit.id_enquete);
    this.form.get('annee')?.setValue(situation.temps.annee);
    this.form.get('denre')?.setValue(situation.produit.nom_prod);
    this.form.get('unite')?.setValue(situation.produit.unite);
    this.form.get('jan')?.setValue(Number(situation.temps.jan));
    this.form.get('fev')?.setValue(Number(situation.temps.fev));
    this.form.get('mar')?.setValue(Number(situation.temps.mar));
    this.form.get('avr')?.setValue(Number(situation.temps.avr));
    this.form.get('mai')?.setValue(Number(situation.temps.mai));
    this.form.get('jui')?.setValue(Number(situation.temps.jui));
    this.form.get('juil')?.setValue(Number(situation.temps.juill));
    this.form.get('aou')?.setValue(Number(situation.temps.aou));
    this.form.get('sep')?.setValue(Number(situation.temps.sep));
    this.form.get('oct')?.setValue(Number(situation.temps.oct));
    this.form.get('nov')?.setValue(Number(situation.temps.nov));
    this.form.get('dec')?.setValue(Number(situation.temps.dec));
    await this.gadmStore.selectGadm(situation.produit.id_gadm);
    this.form.get('niveau')?.setValue(this.gadmStore.oneSelect()?.level!);
    console.log(this.gadmStore.oneSelect());
    switch(this.gadmStore.oneSelect()?.level){
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
  selectGadm(niv:number, id:string){
    if(niv > 1){
      const idSep = id.split('.');
      const id_province = idSep[0] + "." + idSep[1] + "_1";
      this.onSelectChangeRegion(id_province);
      this.form.get('id_province')?.setValue(id_province);
      if(niv > 2){
        const id_region = idSep[0] + "." + idSep[1] + "." + idSep[2] + "_1";
        this.onSelectChangeDistrict(id_region);
        this.form.get('id_region')?.setValue(id_region);
        if(niv > 3){
          const district = idSep[0] + "." + idSep[1] + "." + idSep[2] + "." + idSep[3] + "_1";
          this.onSelectChangeCommune(district);
          this.form.get('id_district')?.setValue(district);
          this.form.get('id_commune')?.setValue(id);
        }else{
          this.form.get('id_district')?.setValue(id);
        }
      }else{
        this.form.get('id_region')?.setValue(id);
      }
      
    }else{
      this.form.get('id_province')?.setValue(id);
    }
  }
  async updateDb(csh : CompletSituationHelper){
    this.isUpdateBd.set(true);
    this.isUpload.set(false);
    this.updateSituationBd = {
      produit: csh.produit,
      temps: csh.temps
    }
    const situation : SituationHelper = {
      produit : csh.produit,
      temps : csh.temps,
      es : csh.es
    }
    situation.produit.id_enquete = situation.produit.id_enquete.toLowerCase();
    await this.update(situation);
  }
  isNull = signal(true);
  openDispo(par:CompletSituationHelper){
    this.isNull.set(true);
    if(par.disponibilite && par.disponibilite.id != null){
      this.isNull.set(false);
    }
    this.dialog.open(Dispo,{
      width:'1200px',
      maxWidth:'200vw',
      height:'30%',
      disableClose:true,
      exitAnimationDuration:'300ms',
      enterAnimationDuration:'100ms',
      data:{
        'prod':par.produit,
        'anne':par.temps.annee,
        'es':par.es.nom,
        'isNull': this.isNull(),
        'dispo':this.isNull() ? '' : par.disponibilite
      }
    })
  }


}
