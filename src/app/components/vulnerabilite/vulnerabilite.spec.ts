import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vulnerabilite } from './vulnerabilite';

describe('Vulnerabilite', () => {
  let component: Vulnerabilite;
  let fixture: ComponentFixture<Vulnerabilite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vulnerabilite]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vulnerabilite);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
