import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsCreate } from './es-create';

describe('EsCreate', () => {
  let component: EsCreate;
  let fixture: ComponentFixture<EsCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EsCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
