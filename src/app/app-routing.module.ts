import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {MainmenuComponent} from "./mainmenu/mainmenu.component";


const routes: Routes = [

  { path: 'mainmenu', component:MainmenuComponent },
  { path: '',redirectTo:'/mainmenu', pathMatch:'full'}
];

@NgModule({

  imports: [
    CommonModule,RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
