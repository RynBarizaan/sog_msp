import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportRoomCsvComponent } from './import-room-csv.component';

describe('ImportRoomCsvComponent', () => {
  let component: ImportRoomCsvComponent;
  let fixture: ComponentFixture<ImportRoomCsvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportRoomCsvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportRoomCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
