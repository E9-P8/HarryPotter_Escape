import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalPartComponent } from './final-part.component';

describe('FinalPartComponent', () => {
  let component: FinalPartComponent;
  let fixture: ComponentFixture<FinalPartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalPartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
