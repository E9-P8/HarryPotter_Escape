import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SphereMinigameComponent } from './sphere-minigame.component';

describe('SphereMinigameComponent', () => {
  let component: SphereMinigameComponent;
  let fixture: ComponentFixture<SphereMinigameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SphereMinigameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SphereMinigameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
