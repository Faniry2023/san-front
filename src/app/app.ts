import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Map } from './map/map';
import { Onebyone } from './test/onebyone/onebyone';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('SAN');
}
