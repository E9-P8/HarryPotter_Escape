import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrapdoorEnigmaComponent } from './trapdoor-enigma.component';

describe('TrapdoorEnigmaComponent', () => {
  let component: TrapdoorEnigmaComponent;
  let fixture: ComponentFixture<TrapdoorEnigmaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrapdoorEnigmaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrapdoorEnigmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
