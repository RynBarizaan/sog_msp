import { Component, OnInit } from '@angular/core';
import {PersonDataService} from "../person-data.service";

@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.css']
})
export class MainmenuComponent implements OnInit {

  constructor(private persondataservice:PersonDataService) { }

  ngOnInit(): void {
  }

  isDataExcist(): boolean{
    // @ts-ignore
    let dataLength=JSON.parse(localStorage.getItem("isDataConfirm"));
    if (dataLength)
      return true;
    else {
      return false;
    }
  }

}
