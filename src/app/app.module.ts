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
import {Ng5SliderModule} from "ng5-slider";
import {MatInputModule} from "@angular/material/input";
import {RouterModule} from "@angular/router";


@NgModule({
  declarations: [
    AppComponent,
    MainmenuComponent,
    GroupTableComponent,
    SliderComponent,

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
    Ng5SliderModule,
    MatInputModule,
    RouterModule.forRoot([
      {path:'', component:SliderComponent},
      {path: 'groupTable/:value', component:GroupTableComponent}

    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
