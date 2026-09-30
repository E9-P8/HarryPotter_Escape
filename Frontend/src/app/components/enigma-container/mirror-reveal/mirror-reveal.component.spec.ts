import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MirrorRevealComponent } from './mirror-reveal.component';

describe('MirrorRevealComponent', () => {
  let component: MirrorRevealComponent;
  let fixture: ComponentFixture<MirrorRevealComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MirrorRevealComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MirrorRevealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
