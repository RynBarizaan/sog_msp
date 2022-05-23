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
  elementOfDelete!:string;
  gruppeStatus:string = 'Gruppe erstellen';
  raumStatus:string = 'Raum erstellen';
  constructor(private router: Router) { }

  // Modal Box for Import-CSV
  ngOnInit(): void {
    this.formModal = new window.bootstrap.Modal(
      document.getElementById("ModalBoxImport"))
    this.formModalDelete = new window.bootstrap.Modal(
      document.getElementById("InfoMessage")
    )
    this.isRoomAvailable();
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
      this.gruppeStatus = 'Gruppe bearbeiten';
      return true;
    }
    else  {
      this.gruppeStatus = 'Gruppe erstellen';
      return false;
    }
  }


  isRoomAvailable(): boolean {
    let room: any;
    room = sessionStorage.getItem("room");
    room = JSON.parse(room);
    let el: any = document.getElementById('roomBtn');
    if(room !== null){
      el.classList.remove('btn-primary');
      el.classList.add('btn-success');
      this.raumStatus = 'Raum bearbeiten';
      return true;
    } else {
      el.classList.remove('btn-success');
      el.classList.add('btn-primary');
      this.raumStatus = 'Raum erstellen';
      return false;
    }
  }

  ////// check if a grupp and room already created /////
  isDataAndRoomExist(): boolean{
    if (this.isDataExist() && this.isRoomAvailable()){
      return true;
    }
    else  {
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

  ////// delete the Grupp or Room  /////
  removeGruppe(el:string){
    if (el === "grupp"){
      this.elementOfDelete="grupp";
      this.formModalDelete = new window.bootstrap.Modal(
        document.getElementById("InfoMessage")
      )
      this.formModalDelete.show();
    }
    else if(el === "room"){
      this.elementOfDelete="room";
      this.formModalDelete = new window.bootstrap.Modal(
        document.getElementById("InfoMessage")
      )
      this.formModalDelete.show();
    }
    else {
      console.log("fehlermeldung");
    }

  }

  //// reject delete of Grupp table or Room /////
  closeInfoMessageModal() {
    this.formModalDelete.hide();
  }

  confirmModalText() {
    if (this.elementOfDelete === "room"){
      sessionStorage.removeItem("room");
      this.isRoomAvailable();
      this.formModalDelete.hide();
    }
    else if(this.elementOfDelete === "grupp" ){
      sessionStorage.setItem("isDataConfirm", JSON.stringify(false));
      sessionStorage.setItem("TheStatus", JSON.stringify(true));
      sessionStorage.removeItem('person');
      this.gruppeStatus = 'Gruppe erstellen';
      this.formModalDelete.hide();
    }
    else{
      console.log("Fehlermeldung");
    }

  }


  //////// send on Sitzordnung Component ////////
  toCreatRandomSeat(){
    this.router.navigate(['/sitzordnung']);
  }

}
