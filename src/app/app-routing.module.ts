import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {MainmenuComponent} from "./mainmenu/mainmenu.component";
import {TestComponent} from "./test/test.component";


const routes: Routes = [

  { path: 'mainmenu', component:MainmenuComponent },
  { path: '',redirectTo:'/mainmenu', pathMatch:'full'},
  {path: 'test',component:TestComponent}
];

@NgModule({

  imports: [
    CommonModule,RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
