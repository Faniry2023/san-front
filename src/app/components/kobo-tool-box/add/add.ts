import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiKeyKoboModel } from '../../../models/api-key-kobo-model';
import { KoboToolboxStore } from '../../../store/kobo.store';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-add',
  imports: [ReactiveFormsModule,MatProgressSpinner],
  templateUrl: './add.html',
  styleUrl: './add.css',
})
export class Add implements OnInit{
constructor(private dialogRef: MatDialogRef<Add>, @Inject(MAT_DIALOG_DATA) public data:any){}
  id_utilisateur = signal("");
  apiStore = inject(KoboToolboxStore);
  private fb = inject(FormBuilder);
  form = this.fb.group({
    api:['',[Validators.required]]
  })
  ngOnInit() {
    this.id_utilisateur.set(this.data.id_utilisateur);
  }
  cancel(){
    this.dialogRef.close();
  }
  async add(){
    if(this.form.valid){
      const apiKey:ApiKeyKoboModel = {
        id:'',
        id_utilisateur : this.id_utilisateur(),
        key : this.form.value.api!,
      }
      await this.apiStore.addApi(apiKey);

      if(this.apiStore.ajoutOk() && !this.apiStore.isError() && !this.apiStore.loading_data()){
        await this.apiStore.getAllProject();
        this.dialogRef.close();
      }
    }else{
      alert('Veillez remplir le champ demandé');
    }
  }
}
