
import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import { EnqueteStore } from '../../../store/enquete.store';
import { EnqueteModel } from '../../../models/enquete-model';

@Component({
  selector: 'app-enquete-create',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatProgressSpinner,
    MatSelectModule,
  ],
  templateUrl: './enquete-create.html',
  styleUrl: './enquete-create.css',
})
export class EnqueteCreate {
  constructor(private dialogRef: MatDialogRef<EnqueteCreate>,@Inject(MAT_DIALOG_DATA) public data:any) {}
  private fb = inject(FormBuilder);
  store = inject(EnqueteStore);
    
  form = this.fb.group({
    'nom': ['', Validators.required],
  })

  async save(){
    if(this.form.valid){
      const newEnquete : EnqueteModel = {
        id : '',
        nom : this.form.value.nom!,
      }
      await this.store.addEnquete(newEnquete);
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
