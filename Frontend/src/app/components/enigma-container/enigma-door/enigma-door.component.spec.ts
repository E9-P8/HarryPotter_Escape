import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnigmaDoorComponent } from './enigma-door.component';

describe('EnigmaDoorComponent', () => {
  let component: EnigmaDoorComponent;
  let fixture: ComponentFixture<EnigmaDoorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnigmaDoorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnigmaDoorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
