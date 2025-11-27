import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Onebyone } from './onebyone';

describe('Onebyone', () => {
  let component: Onebyone;
  let fixture: ComponentFixture<Onebyone>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Onebyone]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Onebyone);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
