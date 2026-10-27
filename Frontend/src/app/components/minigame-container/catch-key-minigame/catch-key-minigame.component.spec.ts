import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatchKeyMinigameComponent } from './catch-key-minigame.component';

describe('CatchKeyMinigameComponent', () => {
  let component: CatchKeyMinigameComponent;
  let fixture: ComponentFixture<CatchKeyMinigameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatchKeyMinigameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatchKeyMinigameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
