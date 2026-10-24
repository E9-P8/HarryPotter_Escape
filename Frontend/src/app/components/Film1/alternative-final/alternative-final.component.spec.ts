import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlternativeFinalComponent } from './alternative-final.component';

describe('AlternativeFinalComponent', () => {
  let component: AlternativeFinalComponent;
  let fixture: ComponentFixture<AlternativeFinalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlternativeFinalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlternativeFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
