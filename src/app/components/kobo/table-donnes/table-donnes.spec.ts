import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDonnes } from './table-donnes';

describe('TableDonnes', () => {
  let component: TableDonnes;
  let fixture: ComponentFixture<TableDonnes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableDonnes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableDonnes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
