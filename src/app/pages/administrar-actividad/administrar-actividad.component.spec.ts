import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarActividadComponent } from './administrar-actividad.component';

describe('AdministrarActividadComponent', () => {
  let component: AdministrarActividadComponent;
  let fixture: ComponentFixture<AdministrarActividadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministrarActividadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministrarActividadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
