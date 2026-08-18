import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Part8Component } from './part8.component';

describe('Part8Component', () => {
  let component: Part8Component;
  let fixture: ComponentFixture<Part8Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Part8Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Part8Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
