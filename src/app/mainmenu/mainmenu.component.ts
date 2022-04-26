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
    let dataLength=this.persondataservice.person.length;
   if (dataLength != 0)
    return true;
   else {
     return false;
   }
  }

}
