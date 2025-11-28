import { Component, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginHelper } from '../../helper/login-helper';
import { UtilisateurStore } from '../../store/utilisateur';
import { Router } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatProgressSpinner
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  hide = true;
  private fb = inject(FormBuilder);
  store = inject(UtilisateurStore);
  router = inject(Router);
  erreurs = ["Utilisateur introuvable","Echec de l'authentification"];
  form = this.fb.group({
    identifier: ['', Validators.required],
    password: ['', Validators.required],
    remember: [false]
  });


  async login() {
    if (this.form.invalid) return;
    const loginHelper:LoginHelper ={
      identifier: this.form.value.identifier!,
      password: this.form.value.password!,
      remember: this.form.value.remember!
    }

    await this.store.LoginUtilisateur(loginHelper);
    if(!this.store.isError()){
      this.router.navigate(['home'],
        {
          replaceUrl: true
        }
      );
    }
  }
}
