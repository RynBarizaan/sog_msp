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
  index: number | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  TheStatus :boolean= true ;
  isImputEmpty :boolean= true ;
  private newAttribute: any = new Person("", "",'Löschen',false,false,false,false);
// @ts-ignore
  listOfContacts:Array<any> = JSON.parse(localStorage.getItem("person"));
  neighborList:Array<any>=[];





  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private personData:PersonDataService) {

  }

  ngOnInit(): void {
    this.formModal = new  window.bootstrap.Modal(
      document.getElementById("errorMessage"));
    this.formModal1 = new  window.bootstrap.Modal(
      document.getElementById("exampleModalCenter"))

  }

  test(){
// @ts-ignore
    var test=JSON.parse(localStorage.getItem("person"));
    console.log(test);
  }


//// delete the row from table //////
  delete(d:any){
    this.listOfContacts.splice(d ,1);
    localStorage.setItem("person", JSON.stringify(this.listOfContacts));
  }

////// add empty row to table  ////////
  addField(){
    this.newAttribute = new Person("", "",'Löschen',false,false,false,false);
    this.listOfContacts.push(this.newAttribute);
    localStorage.setItem("person", JSON.stringify(this.listOfContacts));
  }

///// set Value into the table /////
  updateList(id: number, property: string, event: any) {
    const editField = event.target.value;
    if (this.TheStatus){
      this.listOfContacts[id][property] = editField;
      localStorage.setItem("person", JSON.stringify(this.listOfContacts));
    }
    console.log(this.listOfContacts);
  }

//// back to Silder Component  /////
  toSlider(){
    if(this.TheStatus)
      this.router.navigate(['/group-slider']);
    else {
      this.TheStatus = true;
    }
  }




////// check if the there are a empty Input //////
  istInputEmpty(){
    for(var x=0; x<this.listOfContacts.length ; x++){
      if(this.listOfContacts[x]['Vorname'] == "" || this.listOfContacts[x]['Nachname'] == "" ){
        this.TheStatus = true;
      }
      else {
        this.TheStatus = false;
      }
    }
  }

//// confirm the table with values ////
  confirmList(){
    this.istInputEmpty();
    if(this.TheStatus){
      this.formModal.show();
    }
  }


/////// save the table after the Confirm //////
  saveList(){
    localStorage.setItem("isDataConfirm", JSON.stringify(true));
    this.router.navigate(['/mainmenu']);

  }

/////// close the Model of Error //////
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


  openModal(index:number, firstName:string, lastName:string){

    this.index = index;
    this.firstName = firstName;
    this.lastName= lastName;

    var element = <HTMLInputElement> document.getElementById("besideDoor");
    element.checked =this.listOfContacts[index-1]['Türnähe'];

    var element1 = <HTMLInputElement> document.getElementById("besideWindow");
    element1.checked =this.listOfContacts[index-1]['Fensternähe'];

    var element2 = <HTMLInputElement> document.getElementById("besideBoard");
    element2.checked =this.listOfContacts[index-1]['Tafelnähe'];

    var element3 = <HTMLInputElement> document.getElementById("inFront");
    element3.checked =this.listOfContacts[index-1]['Frontal'];
    this.setNeighborList(firstName,lastName);
    this.formModal1.show();
  }
  closeModal(){
    this.formModal1.hide();
  }


  saveProperties(){
    const checkboxBesideDoor = document.getElementById('besideDoor',) as HTMLInputElement | null;
    const checkboxBesideWindow = document.getElementById('besideWindow',) as HTMLInputElement | null;
    const checkboxBesideBoard = document.getElementById('besideBoard',) as HTMLInputElement | null;
    const checkboxInFront = document.getElementById('inFront',) as HTMLInputElement | null;
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
    this.formModal1.hide();

  }





}
