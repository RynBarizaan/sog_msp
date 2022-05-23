import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitzordnungComponent } from './sitzordnung.component';

describe('SitzordnungComponent', () => {
  let component: SitzordnungComponent;
  let fixture: ComponentFixture<SitzordnungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SitzordnungComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SitzordnungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
