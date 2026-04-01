import { Component, inject, Signal, signal } from '@angular/core';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { geoJSON, latLng, MapOptions, tileLayer, Map as LeafletMap} from 'leaflet';
import { Menu } from './menu/menu';
import { ReactiveFormsModule,FormControl,FormsModule } from '@angular/forms';
import { Gadm } from '../../models/gadm';
import pays from '../../../assets/geojson/level00.json';
import province from '../../../assets/geojson/level01.json';
import regions from '../../../assets/geojson/level02.json';
import district from '../../../assets/geojson/level03.json';
import commune from '../../../assets/geojson/level04.json';
import{MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AddSituationStore } from '../../store/addSituation.store';
import { VulnerabiliteStore } from '../../store/vulnerabilite.store';
import { VulnerabiliteHelper } from '../../helper/vulnerabilite/vulnerabilite-helper';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoadingData } from '../kobo/loading-data/loading-data';

@Component({
  selector: 'app-map',
  imports: [LeafletModule,
    Menu,
    ReactiveFormsModule,
    FormsModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Map {
  situationStore = inject(AddSituationStore);
  vulnerabiliteStore = inject(VulnerabiliteStore);
  id_gadm_selected = signal("");
  private dialogRef?:MatDialogRef<LoadingData>;
  private dialog = inject(MatDialog);
  router = inject(Router);
  data_type?:string=""
  currentLayer: any;
  mapOptions: MapOptions = {
    center: latLng(-19.0, 47.0),
    zoom: 6,
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      })
    ]
  };
async ngOnInit() {
  this.openLoading();
  await this.vulnerabiliteStore.getAll();
  await this.situationStore.allInBd();
  if(!this.vulnerabiliteStore.isLoading() && !this.situationStore.isLoading()){
    this.dialogRef?.close();
  }
  this.setLevel(0); // Province par défaut
}
  levelSel= signal(0);
  levelControl = new FormControl(0);
  constructor(){
    this.levelControl.valueChanges.subscribe(value =>{
      // console.log("Niveau selectionné : ",value);
      this.setLevel(value!);
      this.levelSel.set(value!);
    })
  }
  featuresLayers: any[] = [];

  levels:{[key:number]:any} = {
    0: pays,
    1: province,
    2: regions,
    3: district,
    4: commune,
  };
  nameField: { [key: number]: string } = {
    0: "COUNTRY",
    1: "NAME_1",
    2: "NAME_2",
    3: "NAME_3",
    4: "NAME_4"
  };
  codeField: { [key: number]: string } = {
    0: "GID_0",
    1: "GID_1",
    2: "GID_2",
    3: "GID_3",
    4: "GID_4"
  };
  map!:LeafletMap;
  setLevel(level: number) {
    this.featuresLayers = [];
    const field = this.nameField[level];
    const codeField = this.codeField[level];
    this.currentLayer = geoJSON(this.levels[level], {
      style: {
        weight: 1,
        color: '#333',
        fillOpacity: 0.1
      },
      onEachFeature: (feature, layer) => {
        const name = feature.properties[field];
        const code = feature.properties[codeField]
        layer.bindTooltip(name || "Sans nom");
        layer.on('click',() =>{
          this.highlightSelected(layer);
          this.map.fitBounds((layer as any).getBounds());
          this.selectZone(code,level);
        })
        this.featuresLayers.push({
            feature,
            layer
          });
      }
    });
  }
  onMapReady(map:LeafletMap){
    this.map = map;
  }
  async selectZone(id:string,level:number){
    this.id_gadm_selected.set(id);
    await this.vulnerabiliteStore.select_list_map(id);
    await this.situationStore.select_list_map(id);
  }

  selectedLayer: any = null;
  search = signal("");
  onSearch(event: any) {
    this.search.set(event.target.value);
    this.selectByName(this.search(), this.levelSel());
  }
    //selection coloréé
  highlightSelected(layer: any) {

    // Remettre l'ancienne zone à son style normal
    if (this.selectedLayer) {
      this.selectedLayer.setStyle({
        weight: 1,
        color: '#333',
        fillOpacity: 0.1
      });
    }

    // Nouvelle zone colorée
    layer.setStyle({
      weight: 2,
      color: '#ff0000',
      fillOpacity: 0.3
    });

    // Sauvegarder la zone sélectionnée
    this.selectedLayer = layer;
  }


  selectByName(name: string, level :number) {
    // console.log("featuresLayers length:", this.featuresLayers.length);
    // console.log('nom : ' + name + ' niveau : ' + level);
    const field = this.nameField[level];

    const found = this.featuresLayers.find(f =>{
          const value = f.feature.properties[field];
          return value && value.toLowerCase().includes(name.toLowerCase());
    }
    );

    if (!found) {
      // console.warn("Aucune zone trouvée");
      return;
    }

    this.highlightSelected(found.layer);
  }
  openLoading(){
    this.dialogRef = this.dialog.open(LoadingData,{
      width:'1%',
      disableClose:true,
      exitAnimationDuration:'10ms',
      enterAnimationDuration:'100ms'
    })
  }

}
