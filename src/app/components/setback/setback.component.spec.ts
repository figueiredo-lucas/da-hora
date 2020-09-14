import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetbackComponent } from './setback.component';

describe('SetbackComponent', () => {
  let component: SetbackComponent;
  let fixture: ComponentFixture<SetbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
