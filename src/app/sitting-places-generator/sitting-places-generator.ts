import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sitting-places-generator',
  templateUrl: './sitting-places-generator.html',
  styleUrls: ['./sitting-places-generator.css']
})
export class SittingPlacesGenerator implements OnInit {
  // @ts-ignore
  listOfContacts:Array<any> = JSON.parse(sessionStorage.getItem("person"));
    Türnähe:Array<any> =[];
    Fensternähe:Array<any> =[];
    Frontal:Array<any> =[];
    Tafelnähe:Array<any> =[];
    VorneImRaum:Array<any> =[];
    HintenImRaum:Array<any> =[];
    width?:number;
    height?:number;

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
//////// calculate the Area of Room from Meter to PX //////
  CalculateRoomArea(){
    // @ts-ignore
    let heightAndwidth: any = JSON.parse(sessionStorage.getItem("roomDimension"));;
    let width = heightAndwidth.width;
    let height = heightAndwidth.height;
    try {
      if (width > height){
        this.width = 700;
        this.height = 700/(width/height);
        console.log(this.height+","+this.width);
      }
      else if(width <height){
        this.height=700;
        this.width= 700/(height/width);
        console.log(this.height+","+this.width);
      }
      else if(width = height){
        this.height = 700;
        this.width = 700;
      }
    }
    catch (Exception){
      console.log(Exception);
    }



  }

}
