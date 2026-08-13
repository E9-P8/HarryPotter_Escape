import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryEnigmaComponent } from './library-enigma.component';

describe('LibraryEnigmaComponent', () => {
  let component: LibraryEnigmaComponent;
  let fixture: ComponentFixture<LibraryEnigmaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibraryEnigmaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryEnigmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
