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

    this.index = index;
    this.firstName = firstName;
    this.lastName= lastName;
    this.setNeighborList(firstName, lastName);
    ////// call Properties Status /////
    var element = <HTMLInputElement> document.getElementById("besideDoor");
    element.checked =this.listOfContacts[index-1]['Türnähe'];
    element.disabled =false;
    var element1 = <HTMLInputElement> document.getElementById("besideWindow");
    element1.checked =this.listOfContacts[index-1]['Fensternähe'];
    element1.disabled =false;
    var element2 = <HTMLInputElement> document.getElementById("besideBoard");
    element2.checked =this.listOfContacts[index-1]['Tafelnähe'];
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
    if (this.listOfContacts[index-1]['Türnähe']){
      element3.disabled=true;
      element1.disabled=true;
    }
    //////// set Rule of beside the Window ////
    if (this.listOfContacts[index-1]['Fensternähe']){
      element3.disabled=true;
      element.disabled=true;
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


  /////// Logic condation of Eigenschaften ////
  regulateProperties(ID:string){
    var element0 = <HTMLInputElement> document.getElementById(ID);
    var element = <HTMLInputElement> document.getElementById("besideDoor");
    var element1 = <HTMLInputElement> document.getElementById("besideWindow");
    var element3 = <HTMLInputElement> document.getElementById("inFront");
    var element4 = <HTMLInputElement> document.getElementById("backOfTheRoom");
    var element5 = <HTMLInputElement> document.getElementById("frontOfTheRoom");

    if (ID == "besideDoor"){
      //////// set Rule of beside the Door ////
      if (element0.checked){
        element3.disabled=true;
        element1.disabled=true;
      }
      else if(!element0.checked) {
        element3.disabled=false;
        element1.disabled=false;
      }
    }
    else if(ID == "besideWindow"){
      //////// set Rule of beside the Window ////
      if (element0.checked){
        element3.disabled=true;
        element.disabled=true;
      }
      else if(!element0.checked) {
        element3.disabled=false;
        element.disabled=false;
      }
    }
    else if(ID == "inFront"){
      //////// set Rule of Frontal ////
      if (element0.checked){
        element.disabled=true;
        element1.disabled=true;
        element4.disabled=true;
        element5.disabled=true;
        element.checked=false;
        element1.checked=false;
        element4.checked=false;
        element5.checked=false;
      }
      else if(!element0.checked) {
        element.disabled=false;
        element1.disabled=false;
        element4.disabled=false;
        element5.disabled=false;
      }
    }
    else if (ID == "backOfTheRoom"){
      //////// set Rule of back of the Room ////
      if (element0.checked){
        element3.disabled=true;
        element5.disabled=true;
      }
      else if(!element0.checked) {
        element3.disabled=false;
        element5.disabled=false;
      }
    }
    else if (ID == "frontOfTheRoom"){
      //////// set Rule of front of the Room ////
      if (element0.checked){
        element4.disabled=true;
      }
      else if(!element0.checked) {
        element4.disabled=false;
      }
    }


  }

  ////// set or remove the Properties and the Nighbores Status ///////
  saveProperties(){

    /////select check boxes Elements from HTML/////
    const checkboxBesideDoor = document.getElementById('besideDoor',) as HTMLInputElement | null;
    const checkboxBesideWindow = document.getElementById('besideWindow',) as HTMLInputElement | null;
    const checkboxBesideBoard = document.getElementById('besideBoard',) as HTMLInputElement | null;
    const checkboxInFront = document.getElementById('inFront',) as HTMLInputElement | null;
    const checkboxfrontOfTheRoom = document.getElementById('frontOfTheRoom',) as HTMLInputElement | null;
    const checkboxbackOfTheRoom = document.getElementById('backOfTheRoom',) as HTMLInputElement | null;

    /////set Neighbores Status /////
    for (var x=0; x<this.neighborList.length; x++){
      try {
        const checkboxNeighbor = document.getElementById('checkbox'+this.firstName+this.lastName+x,) as HTMLInputElement | null;

        if (checkboxNeighbor?.checked) {

          const index = this.listOfContacts.findIndex(object => {
            return object.Vorname === this.neighborList[x]['Vorname'];
          });

          // @ts-ignore
          this.listOfContacts[this.index-1]['AusnahmenVonNachbern'][x]=this.neighborList[x]['Vorname']+" "+this.neighborList[x]['Nachname'];
          // @ts-ignore
          this.listOfContacts[this.index-1]['AusnahmenVonNachbernAsBoolean'][x]=true;

          // @ts-ignore
          if (this.index < index+1){
            // @ts-ignore
            this.listOfContacts[index]['AusnahmenVonNachbernAsBoolean'][this.index-1]=true;
            // @ts-ignore
            this.listOfContacts[index]['AusnahmenVonNachbern'][this.index-1]=this.listOfContacts[this.index - 1]['Vorname'] + " " + this.listOfContacts[this.index - 1]['Nachname'];
          }
          // @ts-ignore
          else if(this.index > index+1){
            // @ts-ignore
            this.listOfContacts[index]['AusnahmenVonNachbernAsBoolean'][this.index-2]=true;
            // @ts-ignore
            this.listOfContacts[index]['AusnahmenVonNachbern'][this.index-2]=this.listOfContacts[this.index - 1]['Vorname'] + " " + this.listOfContacts[this.index - 1]['Nachname'];
          }
          // @ts-ignore
          console.log(this.listOfContacts[this.index-1]['AusnahmenVonNachbern']);
        }

        //////// delete the Neighbors  /////////
        else if (!checkboxNeighbor?.checked) {
          const index = this.listOfContacts.findIndex(object => {
            return object.Vorname === this.neighborList[x]['Vorname'];
          });

          // @ts-ignore
          this.listOfContacts[this.index-1]['AusnahmenVonNachbernAsBoolean'][x]=false;
          // @ts-ignore
          delete this.listOfContacts[this.index-1]['AusnahmenVonNachbern'][x];

          // @ts-ignore
          if (this.index < index+1){
            // @ts-ignore
            this.listOfContacts[index]['AusnahmenVonNachbernAsBoolean'][this.index-1]=false;
            // @ts-ignore
            delete this.listOfContacts[index]['AusnahmenVonNachbern'][this.index-1];
          }
          // @ts-ignore
          else if(this.index > index+1){
            // @ts-ignore
            this.listOfContacts[index]['AusnahmenVonNachbernAsBoolean'][this.index-2]=false;
            // @ts-ignore
            delete this.listOfContacts[index]['AusnahmenVonNachbern'][this.index-2];
          }
          //this.listOfContacts[index]['AusnahmenVonNachbern'].splice(x,1);
          // @ts-ignore
          console.log(this.listOfContacts[this.index-1]['AusnahmenVonNachbern']);
        }}
      catch (error){
        console.log("there are nothig selected");
      }

    }

    //////// set or remove the Properties  ////////
    if (checkboxBesideDoor?.checked) {
      // @ts-ignore
      this.listOfContacts[this.index-1]['Türnähe'] = true;
      console.log(this.listOfContacts);
    }
    else {

      // @ts-ignore
      this.listOfContacts[this.index-1]['Türnähe'] = false;
    }
    if (checkboxBesideWindow?.checked) {
      // @ts-ignore
      this.listOfContacts[this.index-1]['Fensternähe'] = true;
      console.log(this.listOfContacts);
    }
    else {
      // @ts-ignore
      this.listOfContacts[this.index-1]['Fensternähe'] = false;
    }
    if (checkboxBesideBoard?.checked) {
      // @ts-ignore
      this.listOfContacts[this.index-1]['Tafelnähe'] = true;
      console.log(this.listOfContacts);
    }
    else {
      // @ts-ignore
      this.listOfContacts[this.index-1]['Tafelnähe'] = false;
    }
    if (checkboxInFront?.checked) {
      // @ts-ignore
      this.listOfContacts[this.index-1]['Frontal'] = true;
      console.log(this.listOfContacts);
    }
    else {
      // @ts-ignore
      this.listOfContacts[this.index-1]['Frontal'] = false;
    }
    if (checkboxfrontOfTheRoom?.checked) {
      // @ts-ignore
      this.listOfContacts[this.index-1]['VorneImRaum'] = true;
      console.log(this.listOfContacts);
    }
    else {
      // @ts-ignore
      this.listOfContacts[this.index-1]['VorneImRaum'] = false;
    }
    if (checkboxbackOfTheRoom?.checked) {
      // @ts-ignore
      this.listOfContacts[this.index-1]['HintenImRaum'] = true;
      console.log(this.listOfContacts);
    }
    else {
      // @ts-ignore
      this.listOfContacts[this.index-1]['HintenImRaum'] = false;
    }
    this.formModal1.hide();
    sessionStorage.setItem("person", JSON.stringify(this.listOfContacts));
    console.log(this.listOfContacts);
  }

}
