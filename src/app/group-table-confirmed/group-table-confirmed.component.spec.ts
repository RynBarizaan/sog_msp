import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupTableConfirmedComponent } from './group-table-confirmed.component';

describe('GroupTableConfirmedComponent', () => {
  let component: GroupTableConfirmedComponent;
  let fixture: ComponentFixture<GroupTableConfirmedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupTableConfirmedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupTableConfirmedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
