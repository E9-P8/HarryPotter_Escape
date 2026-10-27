import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChessEnigmaComponent } from './chess-enigma.component';

describe('ChessEnigmaComponent', () => {
  let component: ChessEnigmaComponent;
  let fixture: ComponentFixture<ChessEnigmaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChessEnigmaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChessEnigmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
