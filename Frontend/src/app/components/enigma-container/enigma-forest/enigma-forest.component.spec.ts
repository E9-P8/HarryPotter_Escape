import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnigmaForestComponent } from './enigma-forest.component';

describe('EnigmaForestComponent', () => {
  let component: EnigmaForestComponent;
  let fixture: ComponentFixture<EnigmaForestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnigmaForestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnigmaForestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
