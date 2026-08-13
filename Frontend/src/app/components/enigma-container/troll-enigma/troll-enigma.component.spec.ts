import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrollEnigmaComponent } from './troll-enigma.component';

describe('TrollEnigmaComponent', () => {
  let component: TrollEnigmaComponent;
  let fixture: ComponentFixture<TrollEnigmaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrollEnigmaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrollEnigmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
