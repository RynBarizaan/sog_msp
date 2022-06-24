import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

declare var window:any;
@Component({
  selector: 'app-group-table-confirmed',
  templateUrl: './group-table-confirmed.component.html',
  styleUrls: ['./group-table-confirmed.component.css']
})
export class GroupTableConfirmedComponent implements OnInit {
  // @ts-ignore
  listOfContacts:Array<any> = JSON.parse(sessionStorage.getItem("person"));
  neighborList:Array<any>=[];
  formModal1:any;
  formModal2:any;
  index: number | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  constructor(private router:Router) { }

  ngOnInit(): void {
    this.formModal1 = new  window.bootstrap.Modal(
      document.getElementById("exampleModalCenter"));
    this.formModal2 = new  window.bootstrap.Modal(
      document.getElementById("exampleModalCenter1"));
  }

  toEdit(){
    this.router.navigate(['groupTable/edit']);

  }
  /////// save the table after the Confirm //////
  saveList(){
    sessionStorage.setItem("person", JSON.stringify(this.listOfContacts));
    sessionStorage.setItem("isDataConfirm", JSON.stringify(true));
    this.router.navigate(['/mainmenu']);
  }
  //Dialog Box for Export Data as CSV
  closeEXP(){
    this.formModal2.hide();
  }
  exportDialogBox(){
    this.formModal2.show();
  }


  /////// creat the Neighborlist without the clicked person ////
  setNeighborList(Vorname:string, Nachname:string){
    this.neighborList = this.listOfContacts;
    this.neighborList =this.neighborList.filter(p => !p.Vorname.includes(Vorname) || !p.Nachname.includes(Nachname));
  }


  ////// show Popup of Person Properties with details //////
  openModal(index:number, firstName:string, lastName:string){
    console.log(this.listOfContacts);

    this.index = index;
    this.firstName = firstName;
    this.lastName= lastName;
    this.setNeighborList(firstName, lastName);
    ////// call Properties Status /////
    var element = <HTMLInputElement> document.getElementById("besideDoor");
    element.checked =this.listOfContacts[index-1]['Tuernaehe'];
    element.disabled =false;
    var element1 = <HTMLInputElement> document.getElementById("besideWindow");
    element1.checked =this.listOfContacts[index-1]['Fensternaehe'];
    element1.disabled =false;
    var element2 = <HTMLInputElement> document.getElementById("besideBoard");
    element2.checked =this.listOfContacts[index-1]['Tafelnaehe'];
    element2.disabled =false;
    var element3 = <HTMLInputElement> document.getElementById("inFront");
    element3.checked =this.listOfContacts[index-1]['Frontal'];
    element3.disabled =false;
    var element4 = <HTMLInputElement> document.getElementById("backOfTheRoom");
    element4.checked =this.listOfContacts[index-1]['HintenImRaum'];
    element4.disabled =false;
    var element5 = <HTMLInputElement> document.getElementById("frontOfTheRoom");
    element5.checked =this.listOfContacts[index-1]['VorneImRaum'];
    element5.disabled =false;
    /////////////////

    //////// set Rule of beside the Door ////
    if (this.listOfContacts[index-1]['Tuernaehe']){
      element3.disabled=true;
      element1.disabled=true;
      element2.disabled =true;
    }
    //////// set Rule of beside the Window ////
    if (this.listOfContacts[index-1]['Fensternaehe']){
      element3.disabled=true;
      element.disabled=true;
      element2.disabled=true;
    }
    //////// set Rule of beside the Board ////
    if (this.listOfContacts[index-1]['Tafelnaehe']){
      element3.disabled=true;
      element.disabled=true;
      element1.disabled=true;
    }
    //////// set Rule of Frontal ////
    if (this.listOfContacts[index-1]['Frontal']){
      element.disabled=true;
      element1.disabled=true;
      element4.disabled=true;
      element5.disabled=true;
      element.checked=false;
      element1.checked=false;
      element4.checked=false;
      element5.checked=false;
    }

    if (this.listOfContacts[index-1]['HintenImRaum']){
      element3.disabled=true;
      element5.disabled=true;
    }

    //////// set Rule of front of the Room ////
    if (this.listOfContacts[index-1]['VorneImRaum']){
      element4.disabled=true;
    }

    this.formModal1.show();

    ////// call Neighbores Status /////
    setTimeout(() => {
      for (var x = 0; x < this.neighborList.length; x++) {
        var element6 = <HTMLInputElement>document.getElementById("checkbox" + this.firstName + this.lastName + x);
        element6.checked = this.listOfContacts[index-1]['AusnahmenVonNachbernAsBoolean'][x];
      }
    },250);

  }


  closeModal(){
    this.formModal1.hide();
  }




  ////// set or remove the Properties and the Nighbores Status ///////



}
