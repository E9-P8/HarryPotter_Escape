import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PuzzleFrameComponent } from './puzzle-frame.component';

describe('PuzzleFrameComponent', () => {
  let component: PuzzleFrameComponent;
  let fixture: ComponentFixture<PuzzleFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PuzzleFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PuzzleFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
