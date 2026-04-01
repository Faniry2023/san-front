import { Component, effect, inject, OnInit, signal } from '@angular/core';
import {EChartsOption} from 'echarts'
import {NgxEchartsDirective} from 'ngx-echarts';
import { ReactiveFormsModule,FormControl,FormsModule, FormBuilder, Validators } from '@angular/forms';
import { EChartsType  } from 'echarts/core';
import{MatButtonToggleModule} from '@angular/material/button-toggle';
import { AddSituationStore } from '../../store/addSituation.store';
import { VulnerabiliteStore } from '../../store/vulnerabilite.store';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Gadm } from '../../models/gadm';
import { GadmStore } from '../../store/gadm.store';
import { VulnerabiliteHelper } from '../../helper/vulnerabilite/vulnerabilite-helper';
import { CompletSituationHelper } from '../../helper/complet-situation-helper';

@Component({
  selector: 'app-graphique',
  standalone:true,
  imports: [
    NgxEchartsDirective,
    ReactiveFormsModule,
    FormsModule,
    MatButtonToggleModule,
    MatProgressSpinner,
  ],
  templateUrl: './graphique.html',
  styleUrl: './graphique.css',
})
export class Graphique implements OnInit{
  situationStore = inject(AddSituationStore);
  vulnerabiliteStore = inject(VulnerabiliteStore);
  gadmStore = inject(GadmStore);
  recherche = signal<string>('');
  listeVulnerabilite = signal<VulnerabiliteHelper[]>([]);
  listeSituation = signal<CompletSituationHelper[]>([]);
  months = ['Jan','Fev','Mar','Avr','Mai','Jui','Juil','Aou','Sep','Oct','Nov','Dec'];
  // values = [120,150,180,160,200,220,210,230,190,250,270,300]
  // values2 = [20,30,110,50,80,60,200,230,130,45,170,260]
  chart?: EChartsType;
  // data_type?:string="";
  data_type = signal<string>("");
  fb = inject(FormBuilder);
  nv = signal(1);
  liste_region = signal<Gadm[]>([]);
  liste_district = signal<Gadm[]>([]);
  liste_commune = signal<Gadm[]>([]);
  value = signal<number[]>([]);
  onChartInit(ec: EChartsType) {
    this.chart = ec;
    setTimeout(() => ec.resize(), 0);
  }
  get barOption() : EChartsOption {
    return{
      title:{text:'Graphique en barres'},
      tooltip:{},
      xAxis:{type:'category',data:this.months},
      yAxis:{type:'value'},
      series:[{
        type:'bar',
        data:this.value()
      }]
    }
  };
  form = this.fb.group({
    'nv':[0,[Validators.required]],
    'id_province' : ['',[Validators.required]],
    'id_region' : ['',[Validators.required]],
    'id_district' : ['',[Validators.required]],
    'id_commune' : ['',[Validators.required]],
  })

  constructor(){
    effect(() =>{
      if(this.data_type() == "Vulnérabilité"){
        const lstVul = this.vulnerabiliteStore.listMap();
        const filter_vul = lstVul.filter(vl => vl.val_mensuel?.nom_val.toLocaleLowerCase().includes(this.recherche()));
        this.listeVulnerabilite.set(filter_vul);
      }
      if(this.data_type() == "Situation district"){
        const lstSit = this.situationStore.listMap();
        const sitvul = lstSit!.filter(sit => sit.produit.nom_prod.toLocaleLowerCase().includes(this.recherche()));
        this.listeSituation.set(sitvul);
      }
    })
  }
  async ngOnInit() {
    await this.gadmStore.getGadm();
    await this.situationStore.allInBd();
    await this.vulnerabiliteStore.getAll();
    this.form.get('nv')!.valueChanges
    .subscribe(value => this.onSelectChangeNiv(value?.toString()!));
    
    this.form.get('id_province')!.valueChanges
    .subscribe(value => this.onSelectChangeRegion(value?.toString()!));
    
    this.form.get('id_region')!.valueChanges
    .subscribe(value => this.onSelectChangeDistrict(value?.toString()!));
    
    this.form.get('id_district')!.valueChanges
    .subscribe(value => this.onSelectChangeCommune(value?.toString()!));
    
  }
  onSelectChangeNiv(value : string){
    const newNv = Number(value);
    // console.log(value);
    this.nv.set(newNv);
    // console.log(this.nv());
    this.form.get('id_region')?.reset();
    this.form.get('id_district')?.reset();
    this.form.get('id_commune')?.reset();
    this.form.get('id_province')?.reset();
  }
  onSelectChangeRegion(value : string){
    if(value.length > 1){
      this.initialiseGadmList();
      const select = value.substring(0, value.length - 2).toLowerCase();
      const result = this.gadmStore.regions()?.filter(g => g.id.toLowerCase().includes(select));
      this.liste_region.set(result!);
      // console.log(select);
      this.form.get('id_region')?.reset();
      this.form.get('id_district')?.reset();
      this.form.get('id_commune')?.reset();
    }
    this.getValue(value);
  }
  onSelectChangeDistrict(value : string){
    if(value.length > 1){
      const select = value.substring(0, value.length - 2).toLowerCase();
      const result = this.gadmStore.districts()?.filter(g => g.id.toLowerCase().includes(select));
      this.liste_district.set(result!);
      this.form.get('id_district')?.reset();
      this.form.get('id_commune')?.reset();
    }
    this.getValue(value);
  }
  onSelectChangeCommune(value : string){
    if(value.length > 1){
      this.liste_commune.set([]);
      const select = value.substring(0, value.length - 2).toLowerCase();
      const result = this.gadmStore.communes()?.filter(g => g.id.toLowerCase().includes(select));
      this.liste_commune.set(result!);
      this.form.get('id_commune')?.reset();
    }
    this.getValue(value);
  }
  async getValue(id_gadm : string){
    if(this.data_type() == "Vulnérabilité"){
      await this.vulnerabiliteStore.select_list_map(id_gadm);
    }
    else{
      if(this.data_type() == "Situation district"){
        await this.situationStore.select_list_map(id_gadm);
      }
    }
  }

  async oneValueVul(id:string | undefined){
    await this.vulnerabiliteStore.select_one(id!);
    const tab1 = [
      Number(this.vulnerabiliteStore.selectChartVulnerabilite()?.temps.jan),
      Number(this.vulnerabiliteStore.selectChartVulnerabilite()?.temps.fev),
      Number(this.vulnerabiliteStore.selectChartVulnerabilite()?.temps.mar),
      Number(this.vulnerabiliteStore.selectChartVulnerabilite()?.temps.avr),
      Number(this.vulnerabiliteStore.selectChartVulnerabilite()?.temps.mai),
      Number(this.vulnerabiliteStore.selectChartVulnerabilite()?.temps.jui),
      Number(this.vulnerabiliteStore.selectChartVulnerabilite()?.temps.juill),
      Number(this.vulnerabiliteStore.selectChartVulnerabilite()?.temps.aou),
      Number(this.vulnerabiliteStore.selectChartVulnerabilite()?.temps.sep),
      Number(this.vulnerabiliteStore.selectChartVulnerabilite()?.temps.oct),
      Number(this.vulnerabiliteStore.selectChartVulnerabilite()?.temps.nov),
      Number(this.vulnerabiliteStore.selectChartVulnerabilite()?.temps.dec),
    ]
    this.value.set(tab1);
    console.log('vulnerabilite')
    console.log(this.value());
  }
  async oneValuesit(id:string){
    await this.situationStore.select_one(id)
    const tab2 = [
      Number(this.situationStore.selectChartComplet()?.temps.jan),
      Number(this.situationStore.selectChartComplet()?.temps.fev),
      Number(this.situationStore.selectChartComplet()?.temps.mar),
      Number(this.situationStore.selectChartComplet()?.temps.avr),
      Number(this.situationStore.selectChartComplet()?.temps.mai),
      Number(this.situationStore.selectChartComplet()?.temps.jui),
      Number(this.situationStore.selectChartComplet()?.temps.juill),
      Number(this.situationStore.selectChartComplet()?.temps.aou),
      Number(this.situationStore.selectChartComplet()?.temps.sep),
      Number(this.situationStore.selectChartComplet()?.temps.oct),
      Number(this.situationStore.selectChartComplet()?.temps.nov),
      Number(this.situationStore.selectChartComplet()?.temps.dec),
    ]
    this.value.set(tab2);
    console.log('situation')
    console.log(this.value())
  }
  initialiseGadmList(){
    this.liste_region.set([]);
    this.liste_district.set([]);
    this.liste_commune.set([]);
  }
  // ligne
  get lineOption():EChartsOption {
    return{
      title:{text:'Graphique en ligne'},
      tooltip:{trigger:'axis'},
      xAxis:{type:'category',data:this.months},
      yAxis:{type:'value'},
      series:[{
        type:'line',
        smooth:true,
        data:this.value()
      }]
    }
  }

  get scatterOption() : EChartsOption {
    return{
      title:{text:'Graphique en point'},
      tooltip:{
        formatter: (params:any) => `${this.months[params.data[0]]} : ${params.data[1]}`
      },
      xAxis:{
        type:'category',
        data:this.months
      },
      yAxis:{
        type:'value'
      },
      series:[{
        type:'scatter',
        symbolSize:15,
        data:this.value().map((v,i) =>[i,v])
      }]
    }
  }

  get pieOption():EChartsOption {
    return{
      title:{text:'Graphique circulaire',left:'center'},
      tooltip:{trigger:'item',formatter:'{b} : {c} ({d}%)'},
      series:[{
        type:'pie',
        radius:'60%',
        data:this.months.map((m, i) => ({
          name:m,
          value:this.value()[i]
        })),
        emphasis:{
          itemStyle:{
            shadowBlur:10,
            shadowOffsetX:0
          }
        }
      }]
    }
  }
}
