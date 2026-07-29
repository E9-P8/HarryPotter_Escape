import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinigameHubComponent } from './minigame-hub.component';

describe('MinigameHubComponent', () => {
  let component: MinigameHubComponent;
  let fixture: ComponentFixture<MinigameHubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinigameHubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinigameHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
