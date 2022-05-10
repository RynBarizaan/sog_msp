import { Component, OnInit } from '@angular/core';
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

////// check if a grupp already created /////
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

  ////////// edit or create a Grupp ////
  editOrCreatGruppe(){
if (this.isDataExcist()){
  sessionStorage.setItem("TheStatus", JSON.stringify(true));
  this.router.navigate(['/groupTable/edit']);
}
else {
  this.router.navigate(['/group-slider']);
}
  }

  ////// delete the Grupp  /////
  removeGruppe(){
    sessionStorage.setItem("isDataConfirm", JSON.stringify(false));
    sessionStorage.setItem("TheStatus", JSON.stringify(true));
    sessionStorage.removeItem('person');
    this.gruppeStatus = 'Gruppe erstellen';
  }

}
