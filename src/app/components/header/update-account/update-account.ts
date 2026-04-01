import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { UtilisateurStore } from '../../../store/utilisateur';
import { LoginModel } from '../../../models/login-model';
import { MdpHelper } from '../../../helper/mdp-helper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-account',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatProgressSpinner,
  ],
  templateUrl: './update-account.html',
  styleUrl: './update-account.css',
})
export class UpdateAccount implements OnInit{
  constructor(private dialogRef: MatDialogRef<UpdateAccount>,@Inject(MAT_DIALOG_DATA) public data:any) {}
  private fb = inject(FormBuilder);
  form!: FormGroup;
  utilisateurStore = inject(UtilisateurStore);
  private router = inject(Router)

  async ngOnInit() {
  
  await this.utilisateurStore.getLog();

    // this.form = this.fb.group({
    // 'username': [this.utilisateurStore.login()?.username, Validators.required],
    // 'email': [this.utilisateurStore.login()?.email, Validators.required],
    // 'mdp': ['', Validators.required],
    this.form = this.fb.group({
    'username': [this.utilisateurStore.login()?.username, Validators.required],
    'email': [this.utilisateurStore.login()?.email, Validators.required],
    'mdp0': ['csdfsdfsdfsd', Validators.required],
    'mdp1': ['csdfsdfsdfsd', Validators.required],
    'mdp2': ['csdfsdfsdfsd', Validators.required],
  })
  }
  close(){
    this.dialogRef.close();
  }
  error = signal("");
  isOk = signal(false);
  async save(){
    if(this.form.valid){
      this.isOk.set(true)
      const username = this.form.value.username!;
      const email = this.form.value.email!;
      const ancien_mdp = this.form.value.mdp0!;
      const nouveau_mdp = this.form.value.mdp1!;
      const confir = this.form.value.mdp2!;
      const mdpHelper: MdpHelper ={
        mdp: ancien_mdp
      }
      await this.utilisateurStore.TestMdp(mdpHelper);
      if(!this.utilisateurStore.isMdpOk()){
        this.error.set("Mot de passe incorrecte")
        this.isOk.set(false);
        return;
      }
      if(nouveau_mdp != confir){
        this.error.set("Vérifier la confirmation de votre mot de passe");
        this.isOk.set(false);
        return;
      }
      var conf = confirm("Apres cette modification, vous serez déconnecté. Continuer?")
      if(this.isOk() && conf){
        const loginModel:LoginModel = {
          id:this.utilisateurStore.login()?.id!,
          username:username,
          email:email,
          password:nouveau_mdp,
          remember:false
        }
        await this.utilisateurStore.updateLog(loginModel);
        if(!this.utilisateurStore.isError()){
          this.dialogRef.close();
          await this.utilisateurStore.Logout();
          this.router.navigate(['/login'],{replaceUrl:true});
        }
      }
    

    }else{
      alert('champ incomplet');
    }
  }
  isFieldValid(name:string){
    const formControl = this.form.get(name);
    return formControl?.invalid && (formControl?.dirty || formControl?.touched)
  }
}
//San,2026