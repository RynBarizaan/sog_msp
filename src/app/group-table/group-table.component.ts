import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {Person} from "../model/person";
import {PersonDataService} from "../person-data.service";
import {Injectable} from '@angular/core';



declare var window: any;
@Component({
  selector: 'app-group-table',
  templateUrl: './group-table.component.html',
  styleUrls: ['./group-table.component.css']
})
@Injectable()
export class GroupTableComponent {
  title = 'angular13';
  printVal : number | undefined;
  contenteditable: boolean =false;
  formModal:any;
  formModal1:any;
  formModal2:any;
  index: number | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  modalText: string | undefined;
  // @ts-ignore
  TheStatus :boolean|true= JSON.parse(sessionStorage.getItem("TheStatus"));
  isImputEmpty :boolean= true ;
  private newAttribute: any = new Person("", "",false,false,false,false,false,false,[],[]);
  // @ts-ignore
  listOfContacts:Array<any> = JSON.parse(sessionStorage.getItem("person"));
  neighborList:Array<any>=[];

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private personData:PersonDataService) {}

  ngOnInit(): void {
    this.formModal = new  window.bootstrap.Modal(
      document.getElementById("errorMessage"));
    this.formModal1 = new  window.bootstrap.Modal(
      document.getElementById("exampleModalCenter"));
    this.formModal2 = new  window.bootstrap.Modal(
      document.getElementById("exampleModalCenter1"));

  }

  //Dialog Box for Export Data as CSV
  closeEXP(){
    this.formModal2.hide();
  }
  exportDialogBox(){
    this.formModal2.show();
  }


  //// delete the row from table //////
  delete(d:any){
    this.listOfContacts.splice(d ,1);
    sessionStorage.setItem("person", JSON.stringify(this.listOfContacts));
  }

  ////// add empty row to table  ////////
  addField(){
    this.newAttribute = new Person("", "",false,false,false,false,false,false,[],[]);
    this.listOfContacts.push(this.newAttribute);
    sessionStorage.setItem("person", JSON.stringify(this.listOfContacts));
  }

  ///// set Value into the table /////
  updateList(id: number, property: string, event: any) {
    const editField = event.target.value;
    if (this.TheStatus){
      this.listOfContacts[id][property] = editField;
      sessionStorage.setItem("person", JSON.stringify(this.listOfContacts));
    }
    console.log(this.listOfContacts);
  }

  //// back to Silder Component  /////
  toSlider(){
    if(this.TheStatus){
      this.router.navigate(['/group-slider']);
    }
    else {
      sessionStorage.setItem("TheStatus", JSON.stringify(true));
      this.TheStatus = true;
    }
  }

  ////// check if the there are a empty Input //////
  istInputEmpty(){
    for(var x=0; x<this.listOfContacts.length ; x++){
      if(this.listOfContacts[x]['Vorname'] == "" || this.listOfContacts[x]['Nachname'] == "" ){
        sessionStorage.setItem("TheStatus", JSON.stringify(true));
        this.TheStatus = true;
      }
      else {
        sessionStorage.setItem("TheStatus", JSON.stringify(false));
        this.TheStatus = false;
      }
    }
  }

  //// confirm the table with values ////
  confirmList(){
    this.istInputEmpty();
    if(this.TheStatus){
      this.modalText = "Tragen Sie alle Felder ein, Bitte!"
      this.formModal.show();
    }
    else if (this.listOfContacts[0]['AusnahmenVonNachbernAsBoolean'].length == 0) {
      for (var x=0; x<this.listOfContacts.length-1; x++){
        for (var y=0; y<this.listOfContacts.length; y++){
          this.listOfContacts[y]['AusnahmenVonNachbernAsBoolean'][x]=false;
        }}}
  }

  /////// save the table after the Confirm //////
  saveList(){
    sessionStorage.setItem("person", JSON.stringify(this.listOfContacts));
    sessionStorage.setItem("isDataConfirm", JSON.stringify(true));
    this.router.navigate(['/mainmenu']);
  }

  /////// close the Modal of Error //////
  closeErrorMessageModal(){
    this.formModal.hide();
  }

  /////// creat the Neighborlist without the clicked person ////
  setNeighborList(Vorname:string, Nachname:string){
    this.neighborList = this.listOfContacts;
    this.neighborList =this.neighborList.filter(p => !p.Vorname.includes(Vorname) || !p.Nachname.includes(Nachname));
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
