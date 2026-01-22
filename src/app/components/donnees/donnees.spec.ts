import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Donnees } from './donnees';

describe('Donnees', () => {
  let component: Donnees;
  let fixture: ComponentFixture<Donnees>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Donnees]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Donnees);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
