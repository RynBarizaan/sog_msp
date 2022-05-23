import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sitzordnung',
  templateUrl: './sitzordnung.component.html',
  styleUrls: ['./sitzordnung.component.css']
})
export class SitzordnungComponent implements OnInit {
  // @ts-ignore
  listOfContacts:Array<any> = JSON.parse(sessionStorage.getItem("person"));
    Türnähe:Array<any> =[];
    Fensternähe:Array<any> =[];
    Frontal:Array<any> =[];
    Tafelnähe:Array<any> =[];
    VorneImRaum:Array<any> =[];
    HintenImRaum:Array<any> =[];

  constructor() { }

  ngOnInit(): void {
  }

  getProperties(){
for(var x=0; x<this.listOfContacts.length; x++){
  if (this.listOfContacts[x]["Türnähe"]){
    this.Türnähe.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
  }
  if (this.listOfContacts[x]["Fensternähe"]){
    this.Fensternähe.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
  }

}

    console.log(this.Türnähe, this.Fensternähe);
console.log(this.listOfContacts);

  }

}
