import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoldemortEnigmaComponent } from './voldemort-enigma.component';

describe('VoldemortEnigmaComponent', () => {
  let component: VoldemortEnigmaComponent;
  let fixture: ComponentFixture<VoldemortEnigmaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoldemortEnigmaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoldemortEnigmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
