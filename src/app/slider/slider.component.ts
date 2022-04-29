import { Component, OnInit } from '@angular/core';
import {Options} from "@angular-slider/ngx-slider";
import {ActivatedRoute, Router} from "@angular/router";
import {Person} from "../model/person";

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent  {
  value: number =0 ;
  options: Options ={
    floor:0,
    ceil:37,
    showSelectionBar: true,
  }

  constructor(private router: Router, private route : ActivatedRoute) { }
  private newAttribute: any = new Person("", "",'Löschen',false,false,false,false);
  listOfContacts:Array<any> = [];
  ngOnInit(): void {
  }

/// resend to groub-table Component ////
  toGruppe(){
    this.start();
    this.router.navigate(['groupTable/',this.value]);
    localStorage.setItem("isDataConfirm", JSON.stringify(false));
  }

//// set a table with a count ///////
  start(){
    for (var i=0; i<this.value; i++ ){
      this.newAttribute = new Person("", "",'Löschen',false,false,false,false);
      this.listOfContacts.push(this.newAttribute);
    }
    return localStorage.setItem("person", JSON.stringify(this.listOfContacts));
  }


}
