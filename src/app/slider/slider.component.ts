import { Component, OnInit } from '@angular/core';
import {Options} from "@angular-slider/ngx-slider";
import {ActivatedRoute, Router} from "@angular/router";
import {Person} from "../model/person";


        declare var window: any;

    @Component({
        selector: 'app-slider',
        templateUrl: './slider.component.html',
        styleUrls: ['./slider.component.css']
        })
    export class SliderComponent  {
        formModal:any;
        value: number =0 ;
        options: Options ={
        floor:0,
        ceil:37,
        showSelectionBar: true,
        }

    constructor(private router: Router, private route : ActivatedRoute) { }
        private newAttribute: any = new Person("", "",false,false,false,false,false,false,[],[]);
        listOfContacts:Array<any> = [];
    ngOnInit(): void {
        this.formModal = new  window.bootstrap.Modal(
        document.getElementById("InfoMessage"));
        }

        /// resend to groub-table Component ////
    toGruppe(){

        var personData=sessionStorage.getItem("person");
        if (personData == null){
        this.start();
        this.router.navigate(['groupTable/',this.value]);
        sessionStorage.setItem("isDataConfirm", JSON.stringify(false));
        sessionStorage.setItem("TheStatus", JSON.stringify(true));
        }
        else {
        this.formModal.show();
        }}

        //// set a table with a count ///////
    start(){
        for (var i=0; i<this.value; i++ ){
        this.newAttribute = new Person("", "",false,false,false,false,false,false,[],[]);
        this.listOfContacts.push(this.newAttribute);
        }
        return sessionStorage.setItem("person", JSON.stringify(this.listOfContacts));
        }

    closeInfoMessageModal(){
        this.formModal.hide();
        };

        //// confirm if the User accept to set new Data and lost the exist Data ////
    confirmModalText(){
        this.start();
        sessionStorage.setItem("isDataConfirm", JSON.stringify(false));
        sessionStorage.setItem("TheStatus", JSON.stringify(true));
        this.closeInfoMessageModal();
        this.router.navigate(['groupTable/',this.value]);

        }
        }
