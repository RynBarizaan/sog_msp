import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, FormControl, Validators,} from '@angular/forms';
import {Person} from "../model/person";
import {PersonDataService} from "../person-data.service";
import { ngxCsv } from 'ngx-csv/ngx-csv';
import * as CryptoJS from 'crypto-js';
import {
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from "@angular/core";
import { Title } from "@angular/platform-browser";
import { MatPasswordStrengthComponent } from "@angular-material-extensions/password-strength";
import {encrypt} from "../model/encrypt";
import {GroupTableComponent} from "../group-table/group-table.component";

declare var window: any;


@Component({
  selector: 'app-export-csv',
  templateUrl: './export-csv.component.html',
  styleUrls: ['./export-csv.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportCSVComponent {
  // @ts-ignore
  listOfContacts: Array<any> = JSON.parse(sessionStorage.getItem("person"));
  Encrypt: Array<any> = [];
  password!: string;
  confirmPassword!:string;
  message!:string;
  formModal!: any;
  inputType = false;
  hide = false;

  constructor(public groupTable: GroupTableComponent,) {
  }

  closeModal() {
    this.groupTable.closeEXP()
  }

  ngOnInit(): void {
    this.formModal = new window.bootstrap.Modal(
      document.getElementById("exampleModalCenter1"));
  }
//Password page

  confirmFormControl = new FormControl('', [
    Validators.required,
  ]);
  onStrengthChanged(strength: any): boolean {
    if (strength === 100 && this.password === this.confirmPassword && this.password !="") {
      return this.inputType = true;

    } else {
      return this.inputType = false;
      //this.message ="Bitte wiederholen sie ihre password";
      console.log("Bitte pas eingeben")

    }
  }

  @ViewChild('myInput') myInput!: ElementRef;
  @ViewChild('myInput2') myInput2!: ElementRef;


  //Export Data as Encrypt/CSV

  ExportCSV() {

    this.myInput2.nativeElement.focus();
    this.myInput.nativeElement.focus();



    var arr = [];
      for (let i = 0; i < this.listOfContacts.length; i++) {
        arr.push(this.listOfContacts[i]['Vorname'])
        arr.push(this.listOfContacts[i]['Nachname'])
        arr.push(this.listOfContacts[i]['Türnähe'])
        arr.push(this.listOfContacts[i]['Tafelnähe'])
        arr.push(this.listOfContacts[i]['Frontal'])
        arr.push(this.listOfContacts[i]['Fensternähe'])
      }
      this.Encrypt.push(new encrypt(CryptoJS.AES.encrypt(arr.toString(), this.password.trim()).toString()));

      var options = {
        fieldSeparator: ',',
        quoteStrings: '',
        decimalseparator: '.',
        showLabels: true,
        showTitle: false,
        useBom: false,
        headers: ["Vorname", "Nachname", "Eigenschaften"]
      };
    if (this.inputType){

      new ngxCsv(this.Encrypt, "Liste der Personen", options);
      }
    }

}


