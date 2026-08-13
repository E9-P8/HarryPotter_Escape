import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FireMinigameComponent } from './fire-minigame.component';

describe('FireMinigameComponent', () => {
  let component: FireMinigameComponent;
  let fixture: ComponentFixture<FireMinigameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FireMinigameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FireMinigameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
