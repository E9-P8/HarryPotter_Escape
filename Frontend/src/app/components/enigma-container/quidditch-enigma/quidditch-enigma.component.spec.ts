import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuidditchEnigmaComponent } from './quidditch-enigma.component';

describe('QuidditchEnigmaComponent', () => {
  let component: QuidditchEnigmaComponent;
  let fixture: ComponentFixture<QuidditchEnigmaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuidditchEnigmaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuidditchEnigmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
