import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MainmenuComponent} from "../mainmenu/mainmenu.component";
import {FormControl, Validators} from "@angular/forms";
import * as CryptoJS from 'crypto-js'
import {Person} from "../model/person";
import {decrypt} from "../model/decrypt";

@Component({
  selector: 'app-import-csv',
  templateUrl: './import-csv.component.html',
  styleUrls: ['./import-csv.component.css']
})

export class ImportCsvComponent implements OnInit {
  textToConvert!: string;
  password: any;
  hide = true;
  Decrypt: Array<any> = [];

  public records: any[] = [];
  @ViewChild('csvReader') csvReader: any;

  uploadListener($event: any): void {

    let files = $event.srcElement.files;

    if (this.isValidCSVFile(files[0])) {

      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray);
      };

      reader.onerror = function () {
        console.log('error is occured while reading file!');
      };

    } else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any) {
    let csvArr = [];
    let decArr =[];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');
        // @ts-ignore
        let person: Person = new Person();
        person.Vorname = curruntRecord[0].trim();
        //csvRecord.firstName = curruntRecord[1].trim();
        //csvRecord.lastName = curruntRecord[2].trim();
        csvArr.push(person);
    }
    var data = csvArr.map(t=>t.Vorname);
    var string = data.join('');
    console.log(string);

    this.Decrypt.push(new decrypt(CryptoJS.AES.decrypt(string.trim(), this.password.trim()).toString(CryptoJS.enc.Utf8)))
    var data2= this.Decrypt.map(z=>z.code);
    var string2 = data2.join();
    var splited =string2.split(',')

    //let person: Person = new Person();

    for (let p=1; p < splited.length; p++){
      let rec = (<string>splited[p]).split(',');

    }
    console.log();
    return  csvArr;
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }


  fileReset() {
    this.csvReader.nativeElement.value = "";
    this.records = [];
  }

//html view functions for import
  passFormControl = new FormControl('', [
    Validators.required,
  ]);
  @ViewChild('myInput') myInput!: ElementRef;

  constructor(public mainmenuComponent: MainmenuComponent) { }

  ngOnInit(): void {

  }
  test(){
    this.myInput.nativeElement.focus();
    console.log(CryptoJS.AES.decrypt(this.textToConvert.trim(), this.password.trim()).toString(CryptoJS.enc.Utf8))
  }

  closeModal() {
    this.mainmenuComponent.closeModal()
  }


}
