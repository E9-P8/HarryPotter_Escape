import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnigmaBroomComponent } from './enigma-broom.component';

describe('EnigmaBroomComponent', () => {
  let component: EnigmaBroomComponent;
  let fixture: ComponentFixture<EnigmaBroomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnigmaBroomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnigmaBroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
