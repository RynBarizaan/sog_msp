import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";


declare var window:any;
@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.css']
})
export class MainmenuComponent implements OnInit {
  formModal:any;
  formModalDelete: any;

  gruppeStatus:string = 'Gruppe erstellen';
  constructor(private router: Router) { }

  // Modal Box for Import-CSV
  ngOnInit(): void {
    this.formModal = new window.bootstrap.Modal(
      document.getElementById("ModalBoxImport"))
    this.formModalDelete = new window.bootstrap.Modal(
      document.getElementById("InfoMessage")
    )
  }
  closeModal() {
    this.formModal.hide();
  }
  ImportBox(){
    this.formModal.show();
  }

////// check if a grupp already created /////
  isDataExist(): boolean{
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
  editOrCreatGroup(){
if (this.isDataExist()){
  sessionStorage.setItem("TheStatus", JSON.stringify(true));
  this.router.navigate(['/groupTable/edit']);
}
else {
  this.router.navigate(['/group-slider']);
}
  }

  ////// delete the Grupp  /////
  removeGruppe(){
    this.formModalDelete = new window.bootstrap.Modal(
      document.getElementById("InfoMessage")
    )
    this.formModalDelete.show();

  }

  closeInfoMessageModal() {
    this.formModalDelete.hide();
  }

  confirmModalText() {
    sessionStorage.setItem("isDataConfirm", JSON.stringify(false));
    sessionStorage.setItem("TheStatus", JSON.stringify(true));
    sessionStorage.removeItem('person');
    this.gruppeStatus = 'Gruppe erstellen';
    this.formModalDelete.hide();
  }
}
