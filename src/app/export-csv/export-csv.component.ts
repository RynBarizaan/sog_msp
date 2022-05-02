import { Component, OnInit } from '@angular/core';
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
  styleUrls: ['./export-csv.component.css']
})
export class ExportCSVComponent {
  // @ts-ignore
  listOfContacts: Array<any> = JSON.parse(localStorage.getItem("person"));
  Encrypt: Array<any> = [];
  password!: string;
  confirmPassword!:string;
  formModal!: any;
  inputType: any;
  hide = true;

  constructor(public groupTable: GroupTableComponent,) {
  }

  closeModal() {
    this.groupTable.closeEXP()
  }

  ngOnInit(): void {
    this.formModal = new window.bootstrap.Modal(
      document.getElementById("exampleModalCenter1"));
  }

  onStrengthChanged(strength: number) {
    if (strength === 100) {
      console.log("password is valed", strength, " %")
    } else {
      console.log("Password is valid", strength, " %")
    }
  }

  ExportCSV() {

    if (this.password === "" || this.password ===null && this.confirmPassword ==="" || this.confirmPassword === null) {

    } else {

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

      console.log(this.Encrypt)

      var options = {
        fieldSeparator: ',',
        quoteStrings: '',
        decimalseparator: '.',
        showLabels: true,
        showTitle: false,
        useBom: false,
        headers: ["Vorname", "Nachname", "Eigenschaften"]
      };
      new ngxCsv(this.Encrypt, "Liste der Personen", options);
    }
  }
}


