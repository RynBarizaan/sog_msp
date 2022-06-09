import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sitting-places-generator',
  templateUrl: './sitting-places-generator.html',
  styleUrls: ['./sitting-places-generator.css']
})
export class SittingPlacesGenerator implements OnInit {
  // @ts-ignore
  listOfContacts:Array<any> = JSON.parse(sessionStorage.getItem("person"));
  // @ts-ignore
  listOfTables:Array<any> = JSON.parse(sessionStorage.getItem("room"));
    Türnähe:Array<any> =[];
    Fensternähe:Array<any> =[];
    Frontal:Array<any> =[];
    Tafelnähe:Array<any> =[];
    VorneImRaum:Array<any> =[];
    HintenImRaum:Array<any> =[];
    width?:number;
    height?:number;
    heightOFTable?:number;
    widthOFTable?:number;

  constructor() { }

  ngOnInit(): void {
    this.getProperties();
  }

  getProperties(){
for(var x=0; x<this.listOfContacts.length; x++){
  if (this.listOfContacts[x]["Türnähe"]){
    this.Türnähe.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
  }
  if (this.listOfContacts[x]["Fensternähe"]){
    this.Fensternähe.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
  }
  if (this.listOfContacts[x]["Frontal"]){
    this.Frontal.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
  }
  if (this.listOfContacts[x]["Tafelnähe"]){
    this.Tafelnähe.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
  }
  if (this.listOfContacts[x]["VorneImRaum"]){
    this.VorneImRaum.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
  }
  if (this.listOfContacts[x]["HintenImRaum"]){
    this.HintenImRaum.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
  }

}

    console.log(this.Türnähe, this.Fensternähe, this.Frontal);


  }
//////// calculate the Area of Room from Meter to PX //////
  CalculateRoomArea(){
    // @ts-ignore
    let heightAndwidth: any = JSON.parse(sessionStorage.getItem("roomDimension"));
    let width = heightAndwidth.width;
    let height = heightAndwidth.height;
    this.heightOFTable = this.listOfTables[0].objectHeight;
    this.widthOFTable = this.listOfTables[0].objectWidth;
    console.log(this.heightOFTable+","+this.widthOFTable);
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
    this.setTypesOfTables();

  }



  /////// Analyse places of Table with Algorithms condition ///////
  setTypesOfTables(){
    for (var x=0; x< this.listOfTables.length; x++){
      switch (this.listOfTables[x].element) {
        case "desk":
          /////// check if the Table Frontal ///
          // @ts-ignore
          if ((this.listOfTables[x].y < this.height/3-this.heightOFTable)&&(this.listOfTables[x].x > this.width/3)&&(this.listOfTables[x].x < 2*(this.width/3)-this.widthOFTable)){
            console.log("the Table is in Frontal");
            if (this.Frontal.length != 0){
              var theRemovedElement = this.Frontal.shift();
              this.listOfTables[x].firstname1= theRemovedElement;
            }
            console.log(this.listOfTables);
          }

          /////// check if the Table behind of Room ///
          // @ts-ignore
          if(this.listOfTables[x].y > (this.height/3)*2){
            if (this.HintenImRaum.length != 0 && this.listOfTables[x].firstname1 == "Vorname") {
              var theRemovedElement = this.HintenImRaum.shift();
              this.listOfTables[x].firstname1 = theRemovedElement;
            }
          }
          /////// check if the Table in front of Room ///
          // @ts-ignore
          if(this.listOfTables[x].y < (this.height/3)-this.heightOFTable){
            console.log("step 2");
            if (this.VorneImRaum.length != 0 && this.listOfTables[x].firstname1 == "Vorname") {
              var theRemovedElement = this.VorneImRaum.shift();
              this.listOfTables[x].firstname1 = theRemovedElement;
            }
          }
          break;
      }
    }


    console.log(this.listOfTables[0].element)
  }



}
