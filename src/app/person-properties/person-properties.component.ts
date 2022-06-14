import {Component, Input, OnInit} from '@angular/core';
import {GroupTableComponent} from "../group-table/group-table.component";
import {GroupTableConfirmedComponent} from "../group-table-confirmed/group-table-confirmed.component";
declare var window:any;

@Component({
  selector: 'app-person-properties',
  templateUrl: './person-properties.component.html',
  styleUrls: ['./person-properties.component.css']
})
export class PersonPropertiesComponent implements OnInit {
   formModal1: any;
  @Input() index:any ;
  @Input() firstName: any ;
  @Input() lastName: any;
  @Input() neighborList:Array<any>=[];
  @Input() listOfContacts:Array<any>=[];


  constructor(private  grouptable: GroupTableConfirmedComponent) {

  }

  ngOnInit(): void {
    this.formModal1 = new  window.bootstrap.Modal(
      document.getElementById("exampleModalCenter"));
     //this.firstName = this.grouptable.firstName
     //this.index = this.grouptable.index;
    //this.setNeighborList(this.firstName, this.lastName)





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
    var element6 = <HTMLInputElement> document.getElementById("besideBoard");

    if (ID == "besideDoor"){
      //////// set Rule of beside the Door ////
      if (element0.checked){
        element3.disabled=true;
        element1.disabled=true;
        element6.disabled=true;
      }
      else if(!element0.checked) {
        element3.disabled=false;
        element1.disabled=false;
        element6.disabled=false;
      }
    }
    else if (ID == "besideBoard"){
      if (element0.checked){
        element3.disabled=true;
        element1.disabled=true;
        element.disabled=true;
      }
      else if(!element0.checked) {
        element3.disabled=false;
        element1.disabled=false;
        element.disabled=false;
      }
    }
    else if(ID == "besideWindow"){
      //////// set Rule of beside the Window ////
      if (element0.checked){
        element3.disabled=true;
        element.disabled=true;
        element6.disabled=true;
      }
      else if(!element0.checked) {
        element3.disabled=false;
        element.disabled=false;
        element6.disabled=false;
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

  closeModal(){
    this.grouptable.closeModal();
  }

  saveProperties() {
    //console.log(this.firstName)
    //console.log(this.neighborList);
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
        console.log("there are nothing selected");
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
    this.grouptable.closeModal();


    sessionStorage.setItem("person", JSON.stringify(this.listOfContacts));
    console.log(this.listOfContacts);

  }
}
