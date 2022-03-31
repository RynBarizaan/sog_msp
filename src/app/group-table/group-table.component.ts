import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {SliderComponent} from "../slider/slider.component";
/*export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}*/
@Component({
  selector: 'app-group-table',
  templateUrl: './group-table.component.html',
  styleUrls: ['./group-table.component.css']
})
export class GroupTableComponent {
  title = 'angular13';
  printVal : number | undefined;
  //test: number = this.route.snapshot.params['id'];
  // @ts-ignore
  editField: string;
  private newAttribute: any = { Vorname: 'eintragen', Nachname: "eintragen", symbol: 'Löschen'};
  listOfContacts:Array<any> = [
  ];
  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
    this.start();

  }

  ngOnInit(): void {
  }
  delete(d:any){
    this.listOfContacts.splice(d ,1);
  }
  addField(){
    this.newAttribute = { Vorname: 'eintragen', Nachname: "eintragen", symbol: 'Löschen'};
    this.listOfContacts.push(this.newAttribute)
  }
  changeValue(id: number, property: string, event: any) {
    this.editField = event.target.textContent;


  }
  updateList(id: number, property: string, event: any) {
    const editField = event.target.textContent;
      this.listOfContacts[id][property] = editField;
if(editField == ''){
  event.target.textContent = 'eintragen';
}

    console.log(this.listOfContacts);
  }
  deleteValue(id: number, event: any){
    const editField = event.target.textContent;
    if (editField == 'eintragen'){
      event.target.textContent = '';
    }

  }

  start(){
    var val = this.route.snapshot.params['value'];
    this.printVal=+val;
    console.log('Value of start is',this.printVal);
    for (var i=0; i<val; i++ ){
      this.newAttribute = {Vorname: 'eintragen', Nachname: "eintragen", symbol: 'Löschen'}
           this.listOfContacts.push(this.newAttribute)
    }
    return this.listOfContacts;
  }
  toSlider(){
    this.router.navigate(['']);
  }



}
