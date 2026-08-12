import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadsDogMinigameComponent } from './heads-dog-minigame.component';

describe('HeadsDogMinigameComponent', () => {
  let component: HeadsDogMinigameComponent;
  let fixture: ComponentFixture<HeadsDogMinigameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeadsDogMinigameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadsDogMinigameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
