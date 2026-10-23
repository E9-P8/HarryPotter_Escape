import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpendoorMinigameComponent } from './opendoor-minigame.component';

describe('OpendoorMinigameComponent', () => {
  let component: OpendoorMinigameComponent;
  let fixture: ComponentFixture<OpendoorMinigameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpendoorMinigameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpendoorMinigameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
