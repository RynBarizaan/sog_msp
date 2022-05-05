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
// @ts-ignore
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
  private newAttribute: any = new Person("", "",false,false,false,false,false,false,[]);
// @ts-ignore
  listOfContacts:Array<any> = JSON.parse(sessionStorage.getItem("person"));
  neighborList:Array<any>=[];



  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private personData:PersonDataService) {

  }

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
    this.newAttribute = new Person("", "",false,false,false,false,false,false,[]);
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
      sessionStorage.setItem("person", JSON.stringify(""));
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


  /*
    closePropertiesModal(){
      this.formModal1.hide();
    }

    showPropertiesModal(){
  this.formModal1.show();
  }


  /*
  (click)=" !this.TheStatus? openModal(i+1,group.Vorname,group.Nachname):''"

   */




  setNeighborList(Vorname:string, Nachname:string){
    this.neighborList = this.listOfContacts;
    this.neighborList =this.neighborList.filter(p => !p.Vorname.includes(Vorname) || !p.Nachname.includes(Nachname));
  }
  test2(){
    /////// set Neighbor list Status //////
    var element6 = <HTMLInputElement> document.getElementById("checkbox0");
    element6.checked =true;
  }


  openModal(index:number, firstName:string, lastName:string){

    this.index = index;
    this.firstName = firstName;
    this.lastName= lastName;



    this.setNeighborList(firstName, lastName);

    ////// call Properties Status /////
    var element = <HTMLInputElement> document.getElementById("besideDoor");
    element.checked =this.listOfContacts[index-1]['Türnähe'];
    var element1 = <HTMLInputElement> document.getElementById("besideWindow");
    element1.checked =this.listOfContacts[index-1]['Fensternähe'];
    var element2 = <HTMLInputElement> document.getElementById("besideBoard");
    element2.checked =this.listOfContacts[index-1]['Tafelnähe'];
    var element3 = <HTMLInputElement> document.getElementById("inFront");
    element3.checked =this.listOfContacts[index-1]['Frontal'];
    var element4 = <HTMLInputElement> document.getElementById("backOfTheRoom");
    element4.checked =this.listOfContacts[index-1]['HintenImRaum'];
    var element5 = <HTMLInputElement> document.getElementById("frontOfTheRoom");
    element5.checked =this.listOfContacts[index-1]['VorneImRaum'];
/////////////////

    this.formModal1.show();
    /*
         for (var x=0; x<this.neighborList.length; x++) {
           if( this.listOfContacts[index - 1]['AunahmenVonNachbern'][x] != null){
             var element = <HTMLInputElement> document.getElementById("checkbox"+x);
             var target= this.listOfContacts[index - 1]['AunahmenVonNachbern'][x].includes(this.neighborList[x]['Vorname'] + " " + this.neighborList[x]['Nachname']);
            if(target){
              element.checked = true;
            }
           }


         }

         /*setTimeout(() =>{
           for (var x=0; x<this.neighborList.length ; x++){
             var element = <HTMLInputElement> document.getElementById("checkbox"+x);
             const index = this.listOfContacts.findIndex(object => {return object.Vorname === this.neighborList[x]['Vorname'];});
             var neighborPerson=this.listOfContacts[index]['AunahmenVonNachbern'][x];
             if (neighborPerson != null){
               element.checked =true;
             }
           }

         },500);*/

    /*
         this.listOfContacts[0]['AunahmenVonNachbern'].push("test1");
         this.listOfContacts[0]['AunahmenVonNachbern'].push("test2");
         console.log(this.listOfContacts);
    */

  }

  closeModal(){
    this.formModal1.hide();
  }


  saveProperties(){

    /////set Properties Status /////
    const checkboxBesideDoor = document.getElementById('besideDoor',) as HTMLInputElement | null;
    const checkboxBesideWindow = document.getElementById('besideWindow',) as HTMLInputElement | null;
    const checkboxBesideBoard = document.getElementById('besideBoard',) as HTMLInputElement | null;
    const checkboxInFront = document.getElementById('inFront',) as HTMLInputElement | null;
    const checkboxfrontOfTheRoom = document.getElementById('frontOfTheRoom',) as HTMLInputElement | null;
    const checkboxbackOfTheRoom = document.getElementById('backOfTheRoom',) as HTMLInputElement | null;

    for (var x=0; x<this.neighborList.length; x++){
      try {
        const checkboxNeighbor = document.getElementById('checkbox'+x,) as HTMLInputElement | null;

        if (checkboxNeighbor?.checked) {

          const index = this.listOfContacts.findIndex(object => {
            return object.Vorname === this.neighborList[x]['Vorname'];
          });

          // @ts-ignore
          this.listOfContacts[this.index-1]['AunahmenVonNachbern'][x]=this.neighborList[x]['Vorname']+" "+this.neighborList[x]['Nachname'];
          // @ts-ignore
          this.listOfContacts[index]['AunahmenVonNachbern'][x]=this.listOfContacts[this.index-1]['Vorname']+" "+this.listOfContacts[this.index-1]['Nachname'];
          // @ts-ignore
          console.log(this.listOfContacts[this.index-1]['AunahmenVonNachbern']);
          //localStorage.setItem("person", JSON.stringify(this.listOfContacts));
        }
        else if (!checkboxNeighbor?.checked) {

          // @ts-ignore
          if (this.listOfContacts[this.index-1]['AunahmenVonNachbern'][x] != undefined){
            const index = this.listOfContacts.findIndex(object => {
              return object.Vorname === this.neighborList[x]['Vorname'];
            });
            // @ts-ignore
            delete this.listOfContacts[this.index-1]['AunahmenVonNachbern'][x];
            delete this.listOfContacts[index]['AunahmenVonNachbern'][x];
            // @ts-ignore
            console.log(this.listOfContacts[this.index-1]['AunahmenVonNachbern']);
          }

        }
      }
      catch (error){
        console.log("there are nothig selected");
      }

    }






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
  }





}
