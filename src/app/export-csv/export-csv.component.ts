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
import { saveAs } from 'file-saver';

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
//Password pagee
  confirmFormControl = new FormControl('', [
    Validators.required,
  ]);
  confirmFormControl1 = new FormControl('', [
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
  @ViewChild('myInput1') myInput1!: ElementRef;


  //Export Data as Encrypt/CSV
  inputValue!: string;
  messageFilenameEmpty!: string;
  onKey(event: any ) {
    this.inputValue = event.target.value;
  }

  ExportGroupCSV() {

    // @ts-ignore
    this.listOfContacts= JSON.parse(sessionStorage.getItem("person"));

    this.myInput2.nativeElement.focus();
    this.myInput1.nativeElement.focus();
    this.myInput.nativeElement.focus();
    console.log(this.inputValue)
    var arr = [];
    arr =[];
    this.Encrypt =[];
    for (let i = 0; i < this.listOfContacts.length; i++) {
      arr.push(JSON.stringify(this.listOfContacts[i]));
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
      new ngxCsv(this.Encrypt, this.inputValue, options);
      this.closeModal();
      }
    }



}


