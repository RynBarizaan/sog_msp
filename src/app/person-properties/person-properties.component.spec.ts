import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonPropertiesComponent } from './person-properties.component';

describe('PersonPropertiesComponent', () => {
  let component: PersonPropertiesComponent;
  let fixture: ComponentFixture<PersonPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
