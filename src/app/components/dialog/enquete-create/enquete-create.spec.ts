import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnqueteCreate } from './enquete-create';

describe('EnqueteCreate', () => {
  let component: EnqueteCreate;
  let fixture: ComponentFixture<EnqueteCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnqueteCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnqueteCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
