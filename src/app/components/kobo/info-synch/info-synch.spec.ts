import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoSynch } from './info-synch';

describe('InfoSynch', () => {
  let component: InfoSynch;
  let fixture: ComponentFixture<InfoSynch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoSynch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoSynch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
