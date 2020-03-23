import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupmodalComponent } from './groupmodal.component';

describe('GroupmodalComponent', () => {
  let component: GroupmodalComponent;
  let fixture: ComponentFixture<GroupmodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupmodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
