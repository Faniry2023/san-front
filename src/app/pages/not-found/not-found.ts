import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-not-found',
  imports: [MatCardModule],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {
constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }
}
