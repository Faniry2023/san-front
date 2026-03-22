import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import { ESModel } from '../../../models/esmodel';
import { EsStore } from '../../../store/es.store';
import { GadmStore } from '../../../store/gadm.store';
import { Gadm } from '../../../models/gadm';

@Component({
  selector: 'app-es-create',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatProgressSpinner,
    MatSelectModule,
  ],
  templateUrl: './es-create.html',
  styleUrl: './es-create.css',
})
export class EsCreate implements OnInit{
  constructor(private dialogRef: MatDialogRef<EsCreate>,@Inject(MAT_DIALOG_DATA) public data:any) {}
  selectedValueDistrict : any;
  selectedValueRegion : any;
  private fb = inject(FormBuilder);
  store = inject(EsStore);
  gadmStore = inject(GadmStore);
  isloadin = signal(false);
  list_commune = signal<Gadm[]>([]);
  list_district = signal<Gadm[]>([]);
  async ngOnInit() {
    await this.gadmStore.getGadm();
  }
    onSelectChangeCommune(event : MatSelectChange){
      this.list_commune.set([]);
      const select = event.value.substr(0, event.value.length - 2).toLowerCase();
      const result = this.gadmStore.communes()?.filter(g => g.id.toLowerCase().includes(select));
      console.log('district selectionner : ' + select + ' // district complet : ' + event.value);
      this.list_commune.set(result!);
    }
    onSelectChangeDistrict(event : MatSelectChange){
      this.list_district.set([]);
      this.list_commune.set([]);
      const select = event.value.substr(0, event.value.length - 2).toLowerCase();
      const result = this.gadmStore.districts()?.filter(g => g.id.toLowerCase().includes(select));
      console.log('region selectionner : ' + select + ' // region complet : ' + event.value);
      this.list_district.set(result!);
    }
    
  form = this.fb.group({
    'nom': ['', Validators.required],
    'prenom': ['', Validators.required],
    'id_gadm_region': ['', Validators.required],
    'id_gadm_district': ['', Validators.required],
    'id_gadm_commune': ['', Validators.required],
    'nb_site': [1, [Validators.required, Validators.min(1),Validators.max(100)]],
    'telephone': ['+261', Validators.required],
  })

  async save(){
    if(this.form.valid){
      const newEs : ESModel = {
        id : '',
        nom : this.form.value.nom!,
        prenom : this.form.value.prenom!,
        id_gadm : this.form.value.id_gadm_commune!,
        nb_site : this.form.value.nb_site!,
        telephone : this.form.value.telephone!
      }

      await this.store.createNewEs(newEs);
      if(!this.store.isError()){
        this.dialogRef.close();
      }
    }
  }
  isFieldValid(name:string){
    const formControl = this.form.get(name);
    return formControl?.invalid && (formControl?.dirty || formControl?.touched)
  }
  close(){
    this.dialogRef.close();
  }
}
