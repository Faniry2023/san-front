import { Component, Signal, signal } from '@angular/core';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { geoJSON, latLng, MapOptions, tileLayer } from 'leaflet';
import { Menu } from './menu/menu';
import { ReactiveFormsModule,FormControl } from '@angular/forms';
import { Gadm } from '../../models/gadm';
import pays from '../../../assets/geojson/level00.json';
import province from '../../../assets/geojson/level01.json';
import regions from '../../../assets/geojson/level02.json';
import district from '../../../assets/geojson/level03.json';
import commune from '../../../assets/geojson/level04.json';

@Component({
  selector: 'app-map',
  imports: [LeafletModule,Menu,ReactiveFormsModule],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Map {
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
ngOnInit() {
  this.setLevel(0); // Province par défaut
}
  levelSel= signal(0);
  levelControl = new FormControl(0);
  constructor(){
    this.levelControl.valueChanges.subscribe(value =>{
      console.log("Niveau selectionné : ",value);
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
  setLevel(level: number) {
    this.featuresLayers = [];
    const field = this.nameField[level];
    this.currentLayer = geoJSON(this.levels[level], {
      style: {
        weight: 1,
        color: '#333',
        fillOpacity: 0.1
      },
      onEachFeature: (feature, layer) => {
        const name = feature.properties[field];
        layer.bindTooltip(name || "Sans nom");
        this.featuresLayers.push({
            feature,
            layer
          });
      }
    });
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
    console.log("featuresLayers length:", this.featuresLayers.length);
    console.log('nom : ' + name + ' niveau : ' + level);
    const field = this.nameField[level];

    const found = this.featuresLayers.find(f =>{
          const value = f.feature.properties[field];
          return value && value.toLowerCase().includes(name.toLowerCase());
    }
    );

    if (!found) {
      console.warn("Aucune zone trouvée");
      return;
    }

    this.highlightSelected(found.layer);
  }

}
