import { Component, OnInit } from '@angular/core';
import {Person} from "../model/person";

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
  statusOfTables:Array<any>=[];
    Türnähe:Array<any> =[];
    Fensternähe:Array<any> =[];
    Frontal:Array<any> =[];
    Tafelnähe:Array<any> =[];
    VorneImRaum:Array<any> =[];
    HintenImRaum:Array<any> =[];
    TürnäheUndHintenImRaum:Array<any> =[];
    TürnäheUndVorneImRaum:Array<any> =[];
    FensternäheUndHintenImRaum:Array<any> =[];
    FensternäheUndVorneImRaum:Array<any> =[];
    TafelnäheUndHintenImRaum:Array<any> =[];
    TafelnäheUndVorneImRaum:Array<any> =[];
    PepoelWithoutProperties:Array<any> =[];
    width?:number;
    height?:number;
    heightOFTable?:number;
    widthOFTable?:number;
    oneMeterInPX?:number;


  constructor() { }

  ngOnInit(): void {
    this.CalculateRoomArea();
  }
  /////// the Method to mix the Values //////
   shuffle(a:any) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
/////// set the Person in Array variables with specific properties //////
  customizeTheGroupThroughProperties(){

    for(var x=0; x<this.listOfContacts.length; x++){
      if (this.listOfContacts[x]["Frontal"]){
        this.Frontal.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
      }
      else if (this.listOfContacts[x]["Türnähe"] && this.listOfContacts[x]["VorneImRaum"]){
        this.TürnäheUndVorneImRaum.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
      }
      else if (this.listOfContacts[x]["Türnähe"] && this.listOfContacts[x]["HintenImRaum"]){
        this.TürnäheUndHintenImRaum.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
      }
      else if (this.listOfContacts[x]["Fensternähe"] && this.listOfContacts[x]["VorneImRaum"]){
        this.FensternäheUndVorneImRaum.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
      }
      else if (this.listOfContacts[x]["Fensternähe"] && this.listOfContacts[x]["HintenImRaum"]){
        this.FensternäheUndHintenImRaum.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
      }
      else if (this.listOfContacts[x]["Tafelnähe"] && this.listOfContacts[x]["VorneImRaum"]){
        this.TafelnäheUndVorneImRaum.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
      }
      else if (this.listOfContacts[x]["Tafelnähe"] && this.listOfContacts[x]["HintenImRaum"]){
        this.TafelnäheUndHintenImRaum.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
      }
      else if (this.listOfContacts[x]["Türnähe"]){
        this.Türnähe.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
      }
      else if (this.listOfContacts[x]["Fensternähe"]){
        this.Fensternähe.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
      }
      else if (this.listOfContacts[x]["Tafelnähe"]){
        this.Tafelnähe.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
      }
      else if (this.listOfContacts[x]["VorneImRaum"]){
        this.VorneImRaum.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
      }
      else if (this.listOfContacts[x]["HintenImRaum"]){
        this.HintenImRaum.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
      }
      else {
    this.PepoelWithoutProperties.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
      }
    }
    this.shuffle(this.Frontal);
    this.shuffle(this.TürnäheUndVorneImRaum);
    this.shuffle(this.TürnäheUndHintenImRaum);
    this.shuffle(this.FensternäheUndVorneImRaum);
    this.shuffle(this.FensternäheUndHintenImRaum);
    this.shuffle(this.TafelnäheUndVorneImRaum);
    this.shuffle(this.TafelnäheUndHintenImRaum);
    this.shuffle(this.Türnähe);
    this.shuffle(this.Fensternähe);
    this.shuffle(this.VorneImRaum);
    this.shuffle(this.HintenImRaum);
    this.shuffle(this.Tafelnähe);
    this.shuffle(this.PepoelWithoutProperties);
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
        this.oneMeterInPX = this.width/width;
        console.log(this.height+","+this.width);
      }
      else if(width <height){
        this.height=700;
        this.width= 700/(height/width);
        this.oneMeterInPX = this.height/height;
        console.log(this.height+","+this.width);
      }
      else if(width = height){
        this.height = 700;
        this.width = 700;
        this.oneMeterInPX = this.height/height;
      }
      if (this.listOfTables.length !=0){
        for (var x=0; x<this.listOfTables.length ; x++){
          this.statusOfTables.push(new Person("","",false,false,false,false,false,false,[],[]));
        }
      }
      this.customizeTheGroupThroughProperties();
      this.setTypesOfTables();
    }
    catch (Exception){
      console.log(Exception);
    }


  }



  /////// Analyse location of Table with Algorithms condition ///////
  setTypesOfTables(){

    for (var x=0; x< this.listOfTables.length; x++) {
      if (this.listOfTables[x].element == "desk") {
        /////// check if the Table Frontal ///
        // @ts-ignore
        if ((this.listOfTables[x].y < this.height / 3 - this.heightOFTable) && (this.listOfTables[x].x > this.width / 3) && (this.listOfTables[x].x < 2 * (this.width / 3) - this.widthOFTable)) {
          this.statusOfTables[x].Frontal = true;
        }

          /////// check if the Table behind of Room ///
        // @ts-ignore
        else if (this.listOfTables[x].y > (this.height / 3) * 2) {
          this.statusOfTables[x].HintenImRaum = true;
        }
          /////// check if the Table in front of Room ///
        // @ts-ignore
        else if (this.listOfTables[x].y < (this.height / 3) - this.heightOFTable) {
          this.statusOfTables[x].VorneImRaum = true;

        }
      }
      /////// check if there are any Table beside the door ///
      else if (this.listOfTables[x].element == "door") {
        if (this.listOfTables[x].platzierung == "rechts") {
          for (var y = 0; y < this.listOfTables.length; y++) {
            if (this.listOfTables[y].element == "desk") {
              // @ts-ignore
              if ((this.listOfTables[y].y > this.listOfTables[x].y) && ((this.listOfTables[y].y < this.listOfTables[x].y + (3 * this.oneMeterInPX)) && ((this.listOfTables[y].x) + this.widthOFTable) > (this.width - this.oneMeterInPX))) {
                this.statusOfTables[y].Türnähe= true;

              }
              // @ts-ignore
              else if ((this.listOfTables[y].y < this.listOfTables[x].y) && ((this.listOfTables[y].y + this.oneMeterInPX + this.heightOFTable) > this.listOfTables[x].y) && ((this.listOfTables[y].x + this.widthOFTable) > (this.width - this.oneMeterInPX))) {
                this.statusOfTables[y].Türnähe= true;
              }
              // @ts-ignore
              else if ((this.listOfTables[y].y == this.listOfTables[x].y) && ((this.listOfTables[y].x + this.widthOFTable) > (this.width - this.oneMeterInPX))) {
                this.statusOfTables[y].Türnähe= true;
              }
            }
          }
        }
        else if (this.listOfTables[x].platzierung == "links") {
          for (var y = 0; y < this.listOfTables.length; y++) {
            if (this.listOfTables[y].element == "desk") {
              // @ts-ignore
              if ((this.listOfTables[y].y > this.listOfTables[x].y) && (this.listOfTables[y].y < this.listOfTables[x].y + 3 * this.oneMeterInPX) && (this.listOfTables[y].x < this.oneMeterInPX)) {
                this.statusOfTables[y].Türnähe= true;

              }
              // @ts-ignore
              else if ((this.listOfTables[y].y < this.listOfTables[x].y) && (this.listOfTables[y].x < this.oneMeterInPX) && ((this.listOfTables[y].y + this.oneMeterInPX + this.heightOFTable) > this.listOfTables[x].y)) {
                this.statusOfTables[y].Türnähe= true;

              }
              // @ts-ignore
              else if ((this.listOfTables[y].y == this.listOfTables[x].y) && (this.listOfTables[y].x < this.oneMeterInPX)) {
                this.statusOfTables[y].Türnähe= true;

              }
            }
          }
        }
        else if (this.listOfTables[x].platzierung == "vorne") {
          for (var y = 0; y < this.listOfTables.length; y++) {
            if (this.listOfTables[y].element == "desk") {
              // @ts-ignore
              if ((this.listOfTables[y].x > this.listOfTables[x].x) && (this.listOfTables[y].x < this.listOfTables[x].x + 3 * this.oneMeterInPX) && (this.listOfTables[y].y < this.oneMeterInPX)) {
                this.statusOfTables[y].Türnähe= true;
              }

              // @ts-ignore
              else if ((this.listOfTables[y].x < this.listOfTables[x].x) && (this.listOfTables[y].y < this.oneMeterInPX) && ((this.listOfTables[y].x + this.oneMeterInPX + this.widthOFTable) > this.listOfTables[x].x)) {
                this.statusOfTables[y].Türnähe= true;
              }
              // @ts-ignore
              else if ((this.listOfTables[y].x == this.listOfTables[x].x) && (this.listOfTables[y].y < this.oneMeterInPX)) {
                this.statusOfTables[y].Türnähe= true;
              }
            }
          }
        }
        else if (this.listOfTables[x].platzierung == "hinten") {
          for (var y = 0; y < this.listOfTables.length; y++) {
            if (this.listOfTables[y].element == "desk") {
              // @ts-ignore
              if ((this.listOfTables[y].x > this.listOfTables[x].x) && (this.listOfTables[y].x < this.listOfTables[x].x + 3 * this.oneMeterInPX) && (this.listOfTables[y].y > this.height - this.oneMeterInPX - this.heightOFTable)) {
                this.statusOfTables[y].Türnähe= true;
              }
              // @ts-ignore
              else if ((this.listOfTables[y].x < this.listOfTables[x].x) && (this.listOfTables[y].y > this.height - this.oneMeterInPX - this.heightOFTable) && ((this.listOfTables[y].x + this.oneMeterInPX + this.widthOFTable) > this.listOfTables[x].x)) {
                this.statusOfTables[y].Türnähe= true;
              }
              // @ts-ignore
              else if ((this.listOfTables[y].x == this.listOfTables[x].x) && (this.listOfTables[y].y > this.height - this.oneMeterInPX - this.heightOFTable)) {
                this.statusOfTables[y].Türnähe= true;
              }
            }
          }
        }
      }
      /////// check if there are any Table beside the window ///
      else if (this.listOfTables[x].element =="window"){
        if (this.listOfTables[x].platzierung =="rechts"){
          for (var y=0; y< this.listOfTables.length; y++) {
            if (this.listOfTables[y].element == "desk") {
              // @ts-ignore
              if ((this.listOfTables[y].y > this.listOfTables[x].y) && ((this.listOfTables[y].y < this.listOfTables[x].y + (3 * this.oneMeterInPX)) && ((this.listOfTables[y].x) + this.widthOFTable) > (this.width - this.oneMeterInPX))) {
                this.statusOfTables[y].Fensternähe= true;
              }
              // @ts-ignore
              else if ((this.listOfTables[y].y < this.listOfTables[x].y) && ((this.listOfTables[y].y + this.oneMeterInPX + this.heightOFTable) > this.listOfTables[x].y) && ((this.listOfTables[y].x + this.widthOFTable) > (this.width - this.oneMeterInPX))) {
                this.statusOfTables[y].Fensternähe= true;
              }
              // @ts-ignore
              else if ((this.listOfTables[y].y == this.listOfTables[x].y) && ((this.listOfTables[y].x + this.widthOFTable) > (this.width - this.oneMeterInPX))) {
                this.statusOfTables[y].Fensternähe= true;
              }
            }
          }
        }
        else if (this.listOfTables[x].platzierung =="links"){
          for (var y=0; y< this.listOfTables.length; y++) {
            if (this.listOfTables[y].element == "desk") {
              // @ts-ignore
              if ((this.listOfTables[y].y > this.listOfTables[x].y) && (this.listOfTables[y].y < this.listOfTables[x].y + 3 * this.oneMeterInPX) && (this.listOfTables[y].x < this.oneMeterInPX)) {
                this.statusOfTables[y].Fensternähe= true;
              }
              // @ts-ignore
              else if ((this.listOfTables[y].y < this.listOfTables[x].y) && (this.listOfTables[y].x < this.oneMeterInPX) && ((this.listOfTables[y].y + this.oneMeterInPX + this.heightOFTable) > this.listOfTables[x].y)) {
                this.statusOfTables[y].Fensternähe= true;
              }
              // @ts-ignore
              else if ((this.listOfTables[y].y == this.listOfTables[x].y) && (this.listOfTables[y].x < this.oneMeterInPX)) {
                this.statusOfTables[y].Fensternähe= true;
              }
            }
          }
        }
        else if (this.listOfTables[x].platzierung =="vorne"){
          for (var y=0; y< this.listOfTables.length; y++) {
            if (this.listOfTables[y].element == "desk") {
              // @ts-ignore
              if ((this.listOfTables[y].x > this.listOfTables[x].x) && (this.listOfTables[y].x < this.listOfTables[x].x + 3 * this.oneMeterInPX) && (this.listOfTables[y].y < this.oneMeterInPX)) {
                this.statusOfTables[y].Fensternähe= true;
              }

              // @ts-ignore
              else if ((this.listOfTables[y].x < this.listOfTables[x].x) && (this.listOfTables[y].y < this.oneMeterInPX) && ((this.listOfTables[y].x + this.oneMeterInPX + this.widthOFTable) > this.listOfTables[x].x)) {
                this.statusOfTables[y].Fensternähe= true;
              }
              // @ts-ignore
              else if ((this.listOfTables[y].x == this.listOfTables[x].x) && (this.listOfTables[y].y < this.oneMeterInPX)) {
                this.statusOfTables[y].Fensternähe= true;
              }
            }
          }
        }

        else if (this.listOfTables[x].platzierung =="hinten"){
          for (var y=0; y< this.listOfTables.length; y++) {
            if (this.listOfTables[y].element == "desk") {
              // @ts-ignore
              if ((this.listOfTables[y].x > this.listOfTables[x].x) && (this.listOfTables[y].x < this.listOfTables[x].x + 3 * this.oneMeterInPX) && (this.listOfTables[y].y > this.height - this.oneMeterInPX - this.heightOFTable)) {
                this.statusOfTables[y].Fensternähe= true;
              }
              // @ts-ignore
              else if ((this.listOfTables[y].x < this.listOfTables[x].x) && (this.listOfTables[y].y > this.height - this.oneMeterInPX - this.heightOFTable) && ((this.listOfTables[y].x + this.oneMeterInPX + this.widthOFTable) > this.listOfTables[x].x)) {
                this.statusOfTables[y].Fensternähe= true;
              }
              // @ts-ignore
              else if ((this.listOfTables[y].x == this.listOfTables[x].x) && (this.listOfTables[y].y > this.height - this.oneMeterInPX - this.heightOFTable)) {
                this.statusOfTables[y].Fensternähe= true;
              }
            }
          }
        }
      }
      /////// check if there are any Table beside the board ///
      else if (this.listOfTables[x].element=="board"){
        if (this.listOfTables[x].platzierung =="rechts"){
          for (var y=0; y< this.listOfTables.length; y++) {
            if (this.listOfTables[y].element == "desk") {
              // @ts-ignore
              if ((this.listOfTables[y].y > this.listOfTables[x].y) && ((this.listOfTables[y].y < this.listOfTables[x].y + (3 * this.oneMeterInPX)) && ((this.listOfTables[y].x) + this.widthOFTable) > (this.width - this.oneMeterInPX))) {
                this.statusOfTables[y].Tafelnähe= true;
              }
              // @ts-ignore
              else if ((this.listOfTables[y].y < this.listOfTables[x].y) && ((this.listOfTables[y].y + this.oneMeterInPX + this.heightOFTable) > this.listOfTables[x].y) && ((this.listOfTables[y].x + this.widthOFTable) > (this.width - this.oneMeterInPX))) {
                this.statusOfTables[y].Tafelnähe= true;
              }
              // @ts-ignore
              else if ((this.listOfTables[y].y == this.listOfTables[x].y) && ((this.listOfTables[y].x + this.widthOFTable) > (this.width - this.oneMeterInPX))) {
                this.statusOfTables[y].Tafelnähe= true;
              }
            }
          }
        }
        else if (this.listOfTables[x].platzierung =="links"){
          for (var y=0; y< this.listOfTables.length; y++) {
            if (this.listOfTables[y].element == "desk") {
              // @ts-ignore
              if ((this.listOfTables[y].y > this.listOfTables[x].y) && (this.listOfTables[y].y < this.listOfTables[x].y + 3 * this.oneMeterInPX) && (this.listOfTables[y].x < this.oneMeterInPX)) {
                this.statusOfTables[y].Tafelnähe= true;
              }
              // @ts-ignore
              else if ((this.listOfTables[y].y < this.listOfTables[x].y) && (this.listOfTables[y].x < this.oneMeterInPX) && ((this.listOfTables[y].y + this.oneMeterInPX + this.heightOFTable) > this.listOfTables[x].y)) {
                this.statusOfTables[y].Tafelnähe= true;
              }
              // @ts-ignore
              else if ((this.listOfTables[y].y == this.listOfTables[x].y) && (this.listOfTables[y].x < this.oneMeterInPX)) {
                this.statusOfTables[y].Tafelnähe= true;
              }
            }
          }
        }
        else if (this.listOfTables[x].platzierung =="vorne"){
          for (var y=0; y< this.listOfTables.length; y++) {
            if (this.listOfTables[y].element == "desk") {
              // @ts-ignore
              if ((this.listOfTables[y].x > this.listOfTables[x].x) && (this.listOfTables[y].x < this.listOfTables[x].x + 3 * this.oneMeterInPX) && (this.listOfTables[y].y < this.oneMeterInPX)) {
                this.statusOfTables[y].Tafelnähe= true;

              }
              // @ts-ignore
              else if ((this.listOfTables[y].x < this.listOfTables[x].x) && (this.listOfTables[y].y < this.oneMeterInPX) && ((this.listOfTables[y].x + this.oneMeterInPX + this.widthOFTable) > this.listOfTables[x].x)) {
                this.statusOfTables[y].Tafelnähe= true;
              }
              // @ts-ignore
              else if ((this.listOfTables[y].x == this.listOfTables[x].x) && (this.listOfTables[y].y < this.oneMeterInPX)) {
                this.statusOfTables[y].Tafelnähe= true;
              }
            }
          }
        }
        else if (this.listOfTables[x].platzierung =="hinten"){
          for (var y=0; y< this.listOfTables.length; y++) {
            if (this.listOfTables[y].element == "desk") {
              // @ts-ignore
              if ((this.listOfTables[y].x > this.listOfTables[x].x) && (this.listOfTables[y].x < this.listOfTables[x].x + 3 * this.oneMeterInPX) && (this.listOfTables[y].y > this.height - this.oneMeterInPX - this.heightOFTable)) {
                this.statusOfTables[y].Tafelnähe= true;
              }
              // @ts-ignore
              else if ((this.listOfTables[y].x < this.listOfTables[x].x) && (this.listOfTables[y].y > this.height - this.oneMeterInPX - this.heightOFTable) && ((this.listOfTables[y].x + this.oneMeterInPX + this.widthOFTable) > this.listOfTables[x].x)) {
                this.statusOfTables[y].Tafelnähe= true;
              }
              // @ts-ignore
              else if ((this.listOfTables[y].x == this.listOfTables[x].x) && (this.listOfTables[y].y > this.height - this.oneMeterInPX - this.heightOFTable)) {
                this.statusOfTables[y].Tafelnähe= true;
              }
            }
          }
        }
      }
    }
    console.log(this.statusOfTables);
    this.setPesronToTable();
  }
///////// push the right Person(person with properties or not) in the right place(Table) ////////
  setPesronToTable(){
    for (var x=0; x<this.statusOfTables.length; x++){
      if ((this.statusOfTables[x].Frontal)&&(this.Frontal.length != 0 && this.listOfTables[x].firstname1 == "Vorname")){
          var theRemovedElement = this.Frontal.shift();
          this.listOfTables[x].firstname1 = theRemovedElement;
      }
      else if ((this.statusOfTables[x].VorneImRaum && this.statusOfTables[x].Türnähe)&&this.TürnäheUndVorneImRaum.length != 0 && this.listOfTables[x].firstname1 == "Vorname"){
          var theRemovedElement = this.TürnäheUndVorneImRaum.shift();
          this.listOfTables[x].firstname1 = theRemovedElement;
      }
      else if ((this.statusOfTables[x].HintenImRaum && this.statusOfTables[x].Türnähe)&&(this.TürnäheUndHintenImRaum.length != 0 && this.listOfTables[x].firstname1 == "Vorname")){
          var theRemovedElement = this.TürnäheUndHintenImRaum.shift();
          this.listOfTables[x].firstname1 = theRemovedElement;
      }
      else if ((this.statusOfTables[x].VorneImRaum && this.statusOfTables[x].Tafelnähe)&&(this.TafelnäheUndVorneImRaum.length != 0 && this.listOfTables[x].firstname1 == "Vorname")){
          var theRemovedElement = this.TafelnäheUndVorneImRaum.shift();
          this.listOfTables[x].firstname1 = theRemovedElement;
      }
      else if ((this.statusOfTables[x].HintenImRaum && this.statusOfTables[x].Tafelnähe)&&(this.TafelnäheUndHintenImRaum.length != 0 && this.listOfTables[x].firstname1 == "Vorname") ){
          var theRemovedElement = this.TafelnäheUndHintenImRaum.shift();
          this.listOfTables[x].firstname1 = theRemovedElement;
      }
      else if ((this.statusOfTables[x].VorneImRaum && this.statusOfTables[x].Fensternähe)&&(this.FensternäheUndVorneImRaum.length != 0 && this.listOfTables[x].firstname1 == "Vorname")){
          var theRemovedElement = this.FensternäheUndVorneImRaum.shift();
          this.listOfTables[x].firstname1 = theRemovedElement;
      }
      else if ((this.statusOfTables[x].HintenImRaum && this.statusOfTables[x].Fensternähe)&&(this.FensternäheUndHintenImRaum.length != 0 && this.listOfTables[x].firstname1 == "Vorname") ){
          var theRemovedElement = this.FensternäheUndHintenImRaum.shift();
          this.listOfTables[x].firstname1 = theRemovedElement;
      }
      else if ((this.statusOfTables[x].Türnähe)&&(this.Türnähe.length != 0 && this.listOfTables[x].firstname1 == "Vorname")){
          var theRemovedElement = this.Türnähe.shift();
          this.listOfTables[x].firstname1 = theRemovedElement;
      }
      else if ((this.statusOfTables[x].Tafelnähe)&&(this.Tafelnähe.length != 0 && this.listOfTables[x].firstname1 == "Vorname")){
          var theRemovedElement = this.Tafelnähe.shift();
          this.listOfTables[x].firstname1 = theRemovedElement;
      }
      else if ((this.statusOfTables[x].Fensternähe)&&(this.Fensternähe.length != 0 && this.listOfTables[x].firstname1 == "Vorname")){
          var theRemovedElement = this.Fensternähe.shift();
          this.listOfTables[x].firstname1 = theRemovedElement;
      }
      else if ((this.statusOfTables[x].VorneImRaum)&&(this.VorneImRaum.length != 0 && this.listOfTables[x].firstname1 == "Vorname")){
          var theRemovedElement = this.VorneImRaum.shift();
          this.listOfTables[x].firstname1 = theRemovedElement;
      }
      else if ((this.statusOfTables[x].HintenImRaum)&&(this.HintenImRaum.length != 0 && this.listOfTables[x].firstname1 == "Vorname")){
          var theRemovedElement = this.HintenImRaum.shift();
          this.listOfTables[x].firstname1 = theRemovedElement;
      }
      else {
        if (this.PepoelWithoutProperties.length != 0 && this.listOfTables[x].firstname1 == "Vorname") {
          var theRemovedElement = this.PepoelWithoutProperties.shift();
          this.listOfTables[x].firstname1 = theRemovedElement;
        }
      }

    }
    console.log(this.listOfTables);
  }



}
