import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { MainmenuComponent } from './mainmenu/mainmenu.component';
import { GroupTableComponent } from './group-table/group-table.component';
import { SliderComponent } from './slider/slider.component';
import {MatSliderModule} from "@angular/material/slider";
import {MatCardModule} from "@angular/material/card";
import {MatNativeDateModule} from '@angular/material/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from "@angular/material/input";
import {NgxSliderModule} from "@angular-slider/ngx-slider";
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {AppRoutingModule} from "./app-routing.module";
import { ExportCSVComponent } from './export-csv/export-csv.component';
import { MatPasswordStrengthModule } from "@angular-material-extensions/password-strength";
import {MatIconModule} from "@angular/material/icon";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import { RoomComponent } from './room/room.component';
import { ImportCsvComponent } from './import-csv/import-csv.component';
import { GroupTableConfirmedComponent } from './group-table-confirmed/group-table-confirmed.component';
import { PersonPropertiesComponent } from './person-properties/person-properties.component';
import {ColorPhotoshopModule} from "ngx-color/photoshop";
import {SittingPlacesGenerator} from "./sitting-places-generator/sitting-places-generator";


@NgModule({
  declarations: [
    AppComponent,
    MainmenuComponent,
    GroupTableComponent,
    SliderComponent,
    PageNotFoundComponent,
    ExportCSVComponent,
    RoomComponent,
    ImportCsvComponent,
    GroupTableConfirmedComponent,
    PersonPropertiesComponent,
    SittingPlacesGenerator


  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    MatSliderModule,
    MatCardModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    NgxSliderModule,
    MatInputModule,
    AppRoutingModule,
    MatPasswordStrengthModule.forRoot(),
    MatPasswordStrengthModule,
    MatIconModule,
    MatSlideToggleModule,
    ColorPhotoshopModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
