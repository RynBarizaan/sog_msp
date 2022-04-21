import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainmenuComponent} from "./mainmenu/mainmenu.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {SliderComponent} from "./slider/slider.component";
import {GroupTableComponent} from "./group-table/group-table.component";


const routes: Routes = [
  { path: 'mainmenu', component:MainmenuComponent },
  { path: '', redirectTo:'/mainmenu', pathMatch:'full'},
  { path: 'group-slider', component:SliderComponent },
  { path: 'groupTable', component:GroupTableComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({

  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
