import { Component, inject, signal, Signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { UtilisateurStore } from '../../store/utilisateur';
import { LoginModel } from '../../models/login-model';
import { UtilisateurModel } from '../../models/utilisateur-model';
import { UtilisateurHelper } from '../../helper/utilisateur-helper';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-formulaire',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinner
  ],
  templateUrl: './formulaire.html',
  styleUrl: './formulaire.css',
})
export class Formulaire {
  private fb = inject(FormBuilder);
  // preview:Signal<string | null > = null;
  preview= signal<string | null>(null);
  store = inject(UtilisateurStore);
  form = this.fb.group({
    username:['',[Validators.required, Validators.minLength(6)]],
    email:['',[Validators.required, Validators.email]],
    password:['',[Validators.required, Validators.minLength(6)]],
    matricule:['',[Validators.required]],
    nom:['',[Validators.required]],
    prenom:['',[Validators.required]],
    contact:['',[Validators.required, Validators.minLength(10), Validators.maxLength(15)]],
    photo:[null as File | null],
  })

  setImage(file:File){
    this.form.patchValue({photo:file});
    const reader = new FileReader();
    reader.onload = () => (this.preview.set(reader.result as string));
    reader.readAsDataURL(file);
  }

  onFileSelected(event:any){
    const file  = event.target.files[0];
    this.setImage(file);
  }

  onDrop(event:DragEvent){
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if(file) this.setImage(file);
  }

  onDragOver(event:DragEvent){
    event.preventDefault();
  }



  async submit(){
    if(this.form.valid){
      const login:LoginModel = {
        id:'',
        username:this.form.value.username!,
        email:this.form.value.email!,
        password:this.form.value.password!,
        remember:false
      };

      const utilisateur:UtilisateurHelper = {
        matricule:this.form.value.matricule!,
        nom:this.form.value.nom!,
        prenom:this.form.value.prenom!,
        contact:this.form.value.contact!
      }
      await this.store.createtUtilisateur(login, utilisateur, this.form.value.photo!);
    }
  }
}
