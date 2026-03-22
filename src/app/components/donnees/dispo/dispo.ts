import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ProduitModel } from '../../../models/produit-model';
import { DisponibiliteHelper } from '../../../helper/disponibilite-helper';
import { TempsModel } from '../../../models/temps-model';
import { AddSituationStore } from '../../../store/addSituation.store';
import { DisponibiliteModel } from '../../../models/disponibilite-model';

@Component({
  selector: 'app-dispo',
  imports: [
    MatInputModule,
    MatFormField,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatProgressSpinner,
  ],
  templateUrl: './dispo.html',
  styleUrl: './dispo.css',
})
export class Dispo implements OnInit{
  constructor(private dialogRef: MatDialogRef<Dispo>, @Inject(MAT_DIALOG_DATA) public data:any){}
  situationStore = inject(AddSituationStore);
  prod = signal<ProduitModel | null>(null);
  annee = signal<number>(0);
  isNull = signal(true);
  isLoadin = true;
  temps = signal<TempsModel | null>(null);
  es = signal("");
  isEdit = signal(false);
  private fb = inject(FormBuilder)
  form!:FormGroup;
  disponibiliteOld = signal<DisponibiliteHelper | null>(null);
  ngOnInit() {
    this.isEdit.set(false);
    this.prod.set(this.data.prod);
    this.annee.set(this.data.anne);
    this.es.set(this.data.es);
    this.isNull.set(this.data.isNull)
    this.form = this.fb.group({
      jan:[{value:0,disabled:false},[Validators.required,Validators.min(0)]],
      fev:[{value:0,disabled:false},[Validators.required,Validators.min(0)]],
      mar:[{value:0,disabled:false},[Validators.required,Validators.min(0)]],
      avr:[{value:0,disabled:false},[Validators.required,Validators.min(0)]],
      mai:[{value:0,disabled:false},[Validators.required,Validators.min(0)]],
      jui:[{value:0,disabled:false},[Validators.required,Validators.min(0)]],
      juil:[{value:0,disabled:false},[Validators.required,Validators.min(0)]],
      aou:[{value:0,disabled:false},[Validators.required,Validators.min(0)]],
      sep:[{value:0,disabled:false},[Validators.required,Validators.min(0)]],
      oct:[{value:0,disabled:false},[Validators.required,Validators.min(0)]],
      nov:[{value:0,disabled:false},[Validators.required,Validators.min(0)]],
      dec:[{value:0,disabled:false},[Validators.required,Validators.min(0)]],
    })
    if(!this.isNull()){
      this.temps.set(this.data.dispo.temps);
      this.disponibiliteOld.set(this.data.dispo);
      const t = this.temps();
      console.log('le temps t : ')
      console.log(this.disponibiliteOld());
      if(t){
        this.form.patchValue({
          jan:t.jan,
          fev:t.fev,
          mar:t.mai,
          avr:t.avr,
          mai:t.mai,
          jui:t.jui,
          juil:t.juill,
          aou:t.aou,
          sep:t.sep,
          oct:t.oct,
          nov:t.nov,
          dec:t.dec,
        })
        this.form.disable();
      }
    }
  }
  cancel(){
    if(this.isEdit()){
      this.form.disable();
      this.isEdit.set(false);
    }else{
      this.dialogRef.close();
    }
  }
  async add(){
    if(this.form.valid){
      const temp:TempsModel = {
        id:(this.isEdit()) ? this.disponibiliteOld()?.temps.id! : '',
        nom_evenement : (this.isEdit()) ? this.disponibiliteOld()?.temps.nom_evenement! : '',
        annee:this.annee(),
        jan:this.form.value.jan?.toString()!,
        fev:this.form.value.fev?.toString()!,
        mar:this.form.value.mar?.toString()!,
        avr:this.form.value.avr?.toString()!,
        mai:this.form.value.mai?.toString()!,
        jui:this.form.value.jui?.toString()!,
        juill:this.form.value.juil?.toString()!,
        aou:this.form.value.aou?.toString()!,
        sep:this.form.value.sep?.toString()!,
        oct:this.form.value.oct?.toString()!,
        nov:this.form.value.nov?.toString()!,
        dec:this.form.value.dec?.toString()!,
      }
      const dispoHelper : DisponibiliteHelper = {
        id:(this.isEdit()) ? this.disponibiliteOld()?.id! : '',
        id_prod: this.prod()?.id!,
        temps:temp
      }
      if(!this.isEdit()){
        await this.situationStore.add_dispo(dispoHelper);
      }else{
        await this.situationStore.update_dispo(dispoHelper);
        this.isEdit.set(false);
      }
      this.dialogRef.close();
    }else{
      alert('veillez remplir tous les champs')
    }
  }
  edit(){
    this.isEdit.set(true);
    this.form.enable();
  }
  async delete(id:string){
    console.log('dispo : ')
    console.log(this.disponibiliteOld())
    await this.situationStore.delete_dispo(id);
    this.form.get('jan')?.reset();
    this.form.get('fev')?.reset();
    this.form.get('mar')?.reset();
    this.form.get('avr')?.reset();
    this.form.get('mai')?.reset();
    this.form.get('jui')?.reset();
    this.form.get('juil')?.reset();
    this.form.get('aou')?.reset();
    this.form.get('sep')?.reset();
    this.form.get('oct')?.reset();
    this.form.get('nov')?.reset();
    this.form.get('dec')?.reset();
    this.form.enable();
  }
}



