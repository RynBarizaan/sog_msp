import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators,} from '@angular/forms';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import * as CryptoJS from 'crypto-js';
import {
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from "@angular/core";
import {encrypt} from "../model/encrypt";
import {GroupTableConfirmedComponent} from "../group-table-confirmed/group-table-confirmed.component";

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
  hide = true;

  constructor(public groupTableConfirmed: GroupTableConfirmedComponent,) {};
  closeModal() {
    this.groupTableConfirmed.closeEXP();
    this.password='';
    this.confirmPassword='';
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
    }
  }

  @ViewChild('myInput') myInput!: ElementRef;
  @ViewChild('myInput2') myInput2!: ElementRef;


  //Export Data as Encrypt/CSV

  ExportCSV() {
    // @ts-ignore
    this.listOfContacts= JSON.parse(sessionStorage.getItem("person"));
    this.myInput2.nativeElement.focus();
    this.myInput.nativeElement.focus();

    var arr = [];
    var listOFNighbore:any=[];
    var komma;
    for (let i = 0; i < this.listOfContacts.length; i++) {
      listOFNighbore =[];
      for (var y=0; y< this.listOfContacts[i]['AusnahmenVonNachbern'].length; y++){
        if (this.listOfContacts[i]['AusnahmenVonNachbern'].length ==1 || y == this.listOfContacts[i]['AusnahmenVonNachbern'].length-1){
          komma =""
        }
        else {
          komma=","
        }
        listOFNighbore += '"'+this.listOfContacts[i]['AusnahmenVonNachbern'][y]+'"'+komma;
      }

      console.log(listOFNighbore);
      arr.push("{"+'"Vorname":'+'"'+this.listOfContacts[i]['Vorname']+'"'+","
        +'"Nachname":'+'"'+this.listOfContacts[i]['Nachname']+'"'+","
        +'"Türnähe":'+this.listOfContacts[i]['Türnähe']+","
        +'"Tafelnähe":'+this.listOfContacts[i]['Tafelnähe']+","
        +'"Frontal":'+this.listOfContacts[i]['Frontal']+","
        +'"Fensternähe":'+this.listOfContacts[i]['Fensternähe']+","
        +'"HintenImRaum":'+this.listOfContacts[i]['HintenImRaum']+","
        +'"VorneImRaum":'+this.listOfContacts[i]['VorneImRaum']+","
        +'"AusnahmenVonNachbern":['+listOFNighbore+']'
        +","+'"AusnahmenVonNachbernAsBoolean":['+this.listOfContacts[i]['AusnahmenVonNachbernAsBoolean']+"]"+"}");
      this.Encrypt.push(new encrypt(CryptoJS.AES.encrypt(arr[i].toString(), this.password.trim()).toString()));
    }

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
      console.log(arr)
      new ngxCsv(this.Encrypt, "Liste der Personen", options);
      this.closeModal();
      }
    }

}


