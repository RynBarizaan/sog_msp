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

  // find the element with the id sitzordnung and remove the disabled class if a room and a person exist in session storage
  // if not, add the disabled class

  checkIfRoomAndPersonExist() {
    let room = sessionStorage.getItem("room");
    let person = sessionStorage.getItem("person");
    if (room && person) {
      // @ts-ignore
      document.getElementById("sitzordnung").classList.remove("disabled");
    } else {
      // @ts-ignore
      document.getElementById("sitzordnung").classList.add("disabled");
    }
  }

  // update the component after loading new routes
  // and run the checkIfRoomAndPersonExist function
  ngAfterContentChecked() {
    this.checkIfRoomAndPersonExist();
  }


}


