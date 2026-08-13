import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatherEnigmaComponent } from './feather-enigma.component';

describe('FeatherEnigmaComponent', () => {
  let component: FeatherEnigmaComponent;
  let fixture: ComponentFixture<FeatherEnigmaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatherEnigmaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatherEnigmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
