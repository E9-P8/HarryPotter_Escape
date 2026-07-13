import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortingHatComponent } from './sorting-hat.component';

describe('SortingHatComponent', () => {
  let component: SortingHatComponent;
  let fixture: ComponentFixture<SortingHatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SortingHatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortingHatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
