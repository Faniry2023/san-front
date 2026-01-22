import { Component, inject, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { KoboToolboxStore } from '../../../store/kobo.store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-data',
  imports: [MatProgressSpinnerModule],
  templateUrl: './loading-data.html',
  styleUrl: './loading-data.css',
})
export class LoadingData{
  constructor(private dialogRef:MatDialogRef<LoadingData>,@Inject(MAT_DIALOG_DATA) public data:any){}
  
}
