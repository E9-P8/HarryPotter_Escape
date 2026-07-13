import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnigmaHubComponent } from './enigma-hub.component';

describe('EnigmaHubComponent', () => {
  let component: EnigmaHubComponent;
  let fixture: ComponentFixture<EnigmaHubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnigmaHubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnigmaHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
