import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainmenuComponent} from "./mainmenu/mainmenu.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {SliderComponent} from "./slider/slider.component";
import {GroupTableComponent} from "./group-table/group-table.component";
import {ExportCSVComponent} from "./export-csv/export-csv.component";
import {RoomComponent} from "./room/room.component";
import {GroupTableConfirmedComponent} from "./group-table-confirmed/group-table-confirmed.component";
import {SittingPlacesGenerator} from "./sitting-places-generator/sitting-places-generator";



const routes: Routes = [
  { path: 'mainmenu', component:MainmenuComponent },
  { path: '', redirectTo:'/mainmenu', pathMatch:'full'},
  { path: 'group-slider', component:SliderComponent },
  { path: 'groupTable/:value', component:GroupTableComponent },
  { path: 'groupTableConfirmed', component:GroupTableConfirmedComponent },
  { path: 'ExportCSV', component: ExportCSVComponent },
  { path: 'room', component: RoomComponent },
  { path: 'sitting-places-generator', component: SittingPlacesGenerator },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({

  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
