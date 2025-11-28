import { Component } from '@angular/core';
import { latLng, tileLayer, geoJSON, MapOptions } from 'leaflet';
import pays from '../../../assets/geojson/level00.json';
import province from '../../../assets/geojson/level01.json';
import regions from '../../../assets/geojson/level02.json';
import district from '../../../assets/geojson/level03.json';
import commune from '../../../assets/geojson/level04.json';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { Gadm } from '../../models/gadm';

@Component({
  selector: 'app-onebyone',
  imports: [LeafletModule],
  templateUrl: './onebyone.html',
  styleUrl: './onebyone.css',
})
export class Onebyone {
  supCode:string = "";
  infCode: any[] = [];
  ListGadm:Gadm[] = [];

  //selection par recherche
  featuresLayers: any[] = [];

  //selection coloré
  selectedLayer: any = null;

  mapOptions: MapOptions = {
    center: latLng(-19.0, 47.0),
    zoom: 6,
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      })
    ]
  };

levels:{[key:number]:any} = {
  0: pays,
  1: province,
  2: regions,
  3: district,
  4: commune,
};

currentLayer: any;

ngOnInit() {
  this.setLevel(0); // Province par défaut
}
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
        console.log('nom : '+name);
        // console.log(name);
        //recherche
          // Sauvegarde
          this.featuresLayers.push({
            feature,
            layer
          });


        layer.on("click", () => {
          this.highlightSelected(layer);
          this.onProvinceSelect(feature,level);
        });
      }
    });
  }
  getProvinceOfContry(code: string) {
    return province.features.filter((f: any) =>
      f.properties.GID_1.startsWith(code.replace("_1", ""))
    );
  }  
  getRegionsOfProvince(code: string) {
    return regions.features.filter((f: any) =>
      f.properties.GID_2.startsWith(code.replace("_1", ""))
    );
  }
  getDistrictsOfRegion(code: string) {
    return district.features.filter((f: any) =>
      f.properties.GID_3.startsWith(code.replace("_1", ""))
    );
  }
  getCommunesOfDistrict(code: string) {
    return commune.features.filter((f: any) =>
      f.properties.GID_4.startsWith(code.replace("_1", ""))
    );
  }

  onProvinceSelect(provinceFeature: any, level: number = 1) {
    console.log(provinceFeature.properties.NAME_1);
    // switch(level) {
    //   case 1:
    //     this.supCode = provinceFeature.properties.GID_1;
    //     this.infCode = this.getRegionsOfProvince(this.supCode);
    //     this.infCode.forEach((region: any) => {
    //       console.log("Région :", region.properties.NAME_2);
    //     });     
    //     break;
    //   case 2:
    //     this.supCode = provinceFeature.properties.GID_2;
    //     this.infCode = this.getDistrictsOfRegion(this.supCode);
    //     this.infCode.forEach((district: any) => {
    //       console.log("District :", district.properties.NAME_3);
    //     });  
    //     break;
    //   case 3:
    //     this.supCode = provinceFeature.properties.GID_3;
    //     this.infCode = this.getCommunesOfDistrict(this.supCode);
    //     this.infCode.forEach((commune: any) => {
    //       console.log("Commune :", commune.properties.NAME_4);
    //     });  
    //     break;
    //   default:
    //     this.supCode = provinceFeature.properties.GID_0;
    //     this.infCode = this.getProvinceOfContry(this.supCode);
    //     this.infCode.forEach((province: any) => {
    //       console.log("province :", province.properties.NAME_1);
    //     });  
    //     break;
    // }

  }


  toGdam(feature:any, level:number) : Gadm{
    return {
      id: feature.properties["GID_"+level],
      level: level,
      nomLevel:this.getNomLevel(level),
      nom: feature.properties[`NAME_${level}`],
      gid:'GID_'+level
    }
  }

  getNomLevel(level:number):string {
    switch(level) {
      case 0: return "Country";
      case 1: return "Province";
      case 2: return "Region";
      case 3: return "District";
      case 4: return "Commune";
      default: return "Unknown";
    }
  }

  recupTout(){
    this.ListGadm = this.levels[0].features.map((f:any) => this.toGdam(f,0));
    for(let i = 1; i <= 4; i++){
      const newGadm = this.levels[i].features.map((f:any) => this.toGdam(f,i));
      this.ListGadm = this.ListGadm.concat(newGadm);
    }
    this.ListGadm.forEach(gadm => {
        console.log(gadm.nom);
      }); 
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

  //recherche methode
  selectByName(name: string, level: number) {
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
logFullGadmList() {
  const results: Gadm[] = [];

  for (let level = 0; level <= 4; level++) {
    const features = this.levels[level].features;

    features.forEach((feature: any) => {
      const gadm: Gadm = {
        id: feature.properties["GID_" + level],
        level: level,
        nomLevel: this.getNomLevel(level),
        nom: (level !== 0)?feature.properties["NAME_" + level]:feature.properties["COUNTRY"],
        gid: "GID_" + level
      };
      results.push(gadm);
    });
  }

  // Affichage propre
  results.forEach((g: Gadm) => {
    console.log(
      `id: ${g.id}, level: ${g.level}, nomLevel: ${g.nomLevel}, nom: ${g.nom}, gid: ${g.gid}`
    );
  });
}


}
