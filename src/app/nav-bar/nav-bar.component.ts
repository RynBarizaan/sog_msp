import { Component, OnInit } from '@angular/core';
import {MainmenuComponent} from "../mainmenu/mainmenu.component";


@Component({
  providers: [MainmenuComponent],
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor( public mainMenu: MainmenuComponent) {
  }

  ngOnInit(): void {
  }

}
