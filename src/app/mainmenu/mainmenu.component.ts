import { Component, OnInit } from '@angular/core';
import {PersonDataService} from "../person-data.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.css']
})
export class MainmenuComponent implements OnInit {
gruppeStatus:string = 'Gruppe erstellen';
  constructor(private router: Router) { }

  ngOnInit(): void {
  }


  isDataExcist(): boolean{
    // @ts-ignore
    let dataLength=JSON.parse(sessionStorage.getItem("isDataConfirm"));
    if (dataLength){
      this.gruppeStatus = 'Gruppe bearbeiten'
      return true;
    }
    else  {
      this.gruppeStatus = 'Gruppe erstellen';
      return false;
    }
  }
  editOrCreatGruppe(){
if (this.isDataExcist()){
  sessionStorage.setItem("TheStatus", JSON.stringify(true));
  this.router.navigate(['/groupTable/value']);
}
else {
  this.router.navigate(['/group-slider']);
}
  }
  removeGruppe(){
    sessionStorage.setItem("isDataConfirm", JSON.stringify(false));
    sessionStorage.setItem("TheStatus", JSON.stringify(true));
    sessionStorage.removeItem('person');
    this.gruppeStatus = 'Gruppe erstellen';
  }

}
