import { Component, OnInit } from '@angular/core';
import {Options} from "@angular-slider/ngx-slider";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent  {
 value: number =0 ;
 options: Options ={
   floor:0,
   ceil:50,
   showSelectionBar: true,
   //getSelectionBarColor: minValue => 'red'
 }

  constructor(private router: Router, private route : ActivatedRoute) { }

  ngOnInit(): void {
  }
  toGruppe(){
   //this.route.snapshot.params['value'] = this.value;
    if (this.value != 0 && this.value != NaN){
      this.router.navigate(['groupTable/',this.value]);
    }
    else {
      console.log("set at least a number");
    }

  }

}
