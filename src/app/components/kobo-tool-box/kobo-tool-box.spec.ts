import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KoboToolBox } from './kobo-tool-box';

describe('KoboToolBox', () => {
  let component: KoboToolBox;
  let fixture: ComponentFixture<KoboToolBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KoboToolBox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KoboToolBox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
