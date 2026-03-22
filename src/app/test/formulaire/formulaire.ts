import { Component, inject, OnInit, signal, Signal } from '@angular/core';
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
import { GadmStore } from '../../store/gadm.store';
import { Gadm } from '../../models/gadm';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
    MatProgressSpinner,
    MatCheckboxModule
  ],
  templateUrl: './formulaire.html',
  styleUrl: './formulaire.css',
})
export class Formulaire implements OnInit{
  private fb = inject(FormBuilder);
  // preview:Signal<string | null > = null;
  preview= signal<string | null>(null);
  store = inject(UtilisateurStore);
  gadmStore = inject(GadmStore);
  list_region = signal<Gadm[]>([]);
  list_district = signal<Gadm[]>([]);
  list_commune = signal<Gadm[]>([]);
  nv = signal<number>(0);
  form = this.fb.group({
    username:['',[Validators.required, Validators.minLength(6)]],
    email:['',[Validators.required, Validators.email]],
    password:['',[Validators.required, Validators.minLength(6)]],
    matricule:['',[Validators.required]],
    nom:['',[Validators.required]],
    prenom:['',[Validators.required]],
    contact:['',[Validators.required, Validators.minLength(10), Validators.maxLength(15)]],
    photo:[null as File | null],
    nv:[0,[Validators.required]],
    id_pro:[''],
    id_reg:[''],
    id_dis:[''],
    id_com:[''],
    isAdmin:[false],

  })
  async ngOnInit(){
    await this.gadmStore.getGadm();
    this.form.get('nv')?.valueChanges.subscribe(value =>
      this.onSelectChangeNiv(value?.toString()!));
    this.form.get('id_pro')?.valueChanges
    .subscribe(value => this.onSelectChangeRegion(value?.toString()!));
    this.form.get('id_reg')?.valueChanges
    .subscribe(value => this.onSelectChangeDistrict(value?.toString()!));
    this.form.get('id_dis')?.valueChanges
    .subscribe(value => this.onSelectChangeCommune(value?.toString()!));
  }
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

  onSelectChangeNiv(value : string){
    const newNv = Number(value);
    console.log(value);
    this.nv.set(newNv);
    console.log(this.nv());

    this.form.get('id_pro')?.reset();
    this.form.get('id_reg')?.reset();
    this.form.get('id_dis')?.reset();
    this.form.get('id_com')?.reset();
  }

  onSelectChangeRegion(value : string){
    if(value.length > 1){
      this.initialiseGadmList();
      const select = value.substring(0, value.length - 2).toLowerCase();
      const result = this.gadmStore.regions()?.filter(g => g.id.toLowerCase().includes(select));
      this.list_region.set(result!);
      console.log(select);
      this.form.get('id_reg')?.reset();
      this.form.get('id_dis')?.reset();
      this.form.get('id_com')?.reset();
    }
  }
  onSelectChangeDistrict(value : string){
    if(value.length > 1){
      const select = value.substring(0, value.length - 2).toLowerCase();
      const result = this.gadmStore.districts()?.filter(g => g.id.toLowerCase().includes(select));
      this.list_district.set(result!);
      this.form.get('id_dis')?.reset();
      this.form.get('id_com')?.reset();
    }
  }
  onSelectChangeCommune(value : string){
    if(value.length > 1){
      this.list_commune.set([]);
      const select = value.substring(0, value.length - 2).toLowerCase();
      const result = this.gadmStore.communes()?.filter(g => g.id.toLowerCase().includes(select));
      this.list_commune.set(result!);
      this.form.get('id_com')?.reset();
    }
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
  initialiseGadmList(){
    this.list_region.set([]);
    this.list_district.set([]);
    this.list_commune.set([]);
  }
  async submit(){
    if(this.form.valid && this.testValidGadm(this.nv())){
      const login:LoginModel = {
        id:'',
        username:this.form.value.username!,
        email:this.form.value.email!,
        password:this.form.value.password!,
        remember:false
      };
        const id_pro = this.form.value.id_pro;
        const id_reg = this.form.value.id_reg;
        const id_dis = this.form.value.id_dis;
        const id_com = this.form.value.id_com;

      const utilisateur:UtilisateurHelper = {
        matricule:this.form.value.matricule!,
        isAdmin:this.form.value.isAdmin!,
        nom:this.form.value.nom!,
        prenom:this.form.value.prenom!,
        contact:this.form.value.contact!,
        image:'',
        gadm:this.nv() == 1 ? id_pro! : (this.nv() == 2 ? id_reg! : (this.nv() == 3 ? id_dis! : (this.nv() == 4 ? id_com! : 'aucun')))!
      }
      await this.store.createtUtilisateur(login, utilisateur, this.form.value.photo!);
    }
  }
}
