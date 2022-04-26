import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {Person} from "../model/person";
import {PersonDataService} from "../person-data.service";

declare var window: any;
@Component({
  selector: 'app-group-table',
  templateUrl: './group-table.component.html',
  styleUrls: ['./group-table.component.css']
})
export class GroupTableComponent {
  title = 'angular13';
  printVal : number | undefined;
  contenteditable: boolean =false;
  //test: number = this.route.snapshot.params['id'];
  // @ts-ignore
  editField: string;
  formModal:any;
  index: number | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  TheStatus :boolean= true ;
  private newAttribute: any = new Person('eintragen', "eintragen",'Löschen',false,false,false,false);
   listOfContacts:Array<any> = [];
  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private personData:PersonDataService) {
    this.start();

  }

  ngOnInit(): void {
   this.formModal = new  window.bootstrap.Modal(
      document.getElementById("exampleModalCenter"))
  }
  delete(d:any){
    this.listOfContacts.splice(d ,1);
  }
  addField(){
    this.newAttribute = new Person('eintragen', "eintragen",'Löschen',false,false,false,false);
    this.listOfContacts.push(this.newAttribute)
  }
  changeValue(id: number, property: string, event: any) {
    if (this.TheStatus)
    this.editField = event.target.textContent;

  }
  updateList(id: number, property: string, event: any) {

    const editField = event.target.textContent;
    if (this.TheStatus)
      this.listOfContacts[id][property] = editField;
if(editField == ''){
  if (this.TheStatus)
  event.target.textContent = 'eintragen';
}

    console.log(this.listOfContacts);
  }
  deleteValue(id: number, event: any){
    if (this.TheStatus){
      const editField = event.target.textContent;
      if (editField == 'eintragen'){
        event.target.textContent = '';
      }

    }

  }

  start(){
    var val = this.route.snapshot.params['value'];
    this.printVal=+val;
    console.log('Value of start is',this.printVal);
    for (var i=0; i<val; i++ ){
      this.newAttribute = new Person('eintragen', "eintragen",'Löschen',false,false,false,false);
           this.listOfContacts.push(this.newAttribute)
    }
    return this.listOfContacts;
  }
  toSlider(){
    if(this.TheStatus)
    this.router.navigate(['/group-slider']);
    else {
      this.TheStatus = true;
    }
  }


  //// remove all empty rows after confirm   ////

  removeEmptyRows(){
    this.listOfContacts =this.listOfContacts.filter(p => !p.Vorname.includes('eintragen') && !p.Nachname.includes('eintragen'));
  }


  //// confirm the table with values ////
  confirmList(): boolean{
    this.removeEmptyRows();
    if (this.listOfContacts.length != 0){
      this.TheStatus = false;
    }
    else {
      alert("Sie müssen mindesten einen Person eintragen !")
      this.addField();
      return this.TheStatus = true;
    }
    return this.TheStatus;
  }

  saveList(){
    this.personData.person = this.listOfContacts;
    console.log(this.personData.person);
    this.router.navigate(['/mainmenu']);

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
    element3.checked =this.listOfContacts[index-1]['Frontal'];;
    this.formModal.show();
  }
  closeModal(){
    this.formModal.hide();
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
    this.formModal.hide();

  }





}
