import { Component } from '@angular/core';
import { latLng, tileLayer, geoJSON, MapOptions } from 'leaflet';
import pays from '../../assets/geojson/level00.json';
import province from '../../assets/geojson/level01.json';
import regions from '../../assets/geojson/level02.json';
import district from '../../assets/geojson/level03.json';
import commune from '../../assets/geojson/level04.json';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
@Component({
  selector: 'app-map',
  imports: [LeafletModule],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Map {
  mapOptions: MapOptions = {
    center: latLng(-19.0, 47.0),
    zoom: 6,
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      })
    ]
  };

  layers = [
    this.makeLayer(pays, 'white'),
    this.makeLayer(province, 'green'),
    // this.makeLayer(regions, 'blue'),
    // this.makeLayer(district, 'red'),
    // this.makeLayer(commune, 'purple')
  ]

    makeLayer(data: any, color: string) {
    return geoJSON(data, {
      style: {
        weight: 1,
        color,
        fillOpacity: 0.3
      },
      onEachFeature: (feature, layer) => {
        layer.bindTooltip(feature.properties.NAME_1 || feature.properties.NAME_2 || feature.properties.NAME_3);
      }
    });
  }
}
