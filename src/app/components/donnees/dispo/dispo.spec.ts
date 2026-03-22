import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dispo } from './dispo';

describe('Dispo', () => {
  let component: Dispo;
  let fixture: ComponentFixture<Dispo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dispo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dispo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
