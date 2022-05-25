import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MainmenuComponent} from "../mainmenu/mainmenu.component";
import {FormControl, Validators} from "@angular/forms";
import * as CryptoJS from 'crypto-js'
import {csvRecord} from "../model/csv-record";


@Component({
  selector: 'app-import-csv',
  templateUrl: './import-csv.component.html',
  styleUrls: ['./import-csv.component.css']
})

export class ImportCsvComponent implements OnInit {


  listOfContacts: Array<any> =[];
  listOfContactsASObject: Array<any> =[];
  Decrypt: Array<any> = [];
  textToConvert!: string;
  password: any;
  hide = true;
  onChange!:true;
  messageIfNoFile!: string;
  messageIfWrongPass!: string;


  public records: any[] = [];
  @ViewChild('csvReader') csvReader: any;

  // Import CSV File in Array
  uploadListener($event: any): void {

    let files = $event.srcElement.files;

    if (this.isValidCSVFile(files[0])) {

      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
        this.getDataRecordsArrayFromCSVFile(csvRecordsArray);
      };

      reader.onerror = function () {
        console.log('error is occured while reading file!');
      };

    }
    else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any) {

    console.log("is works 2")

    let csvArr = [];
    this.listOfContacts=[];
    for (let i = 1; i < csvRecordsArray.length-1; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(/\r\n|\n/);
      let encrypt: csvRecord = new csvRecord();
      csvArr.push(encrypt);
      this.listOfContacts.push((CryptoJS.AES.decrypt(curruntRecord.toString(), this.password.trim()).toString(CryptoJS.enc.Utf8)));
      this.listOfContactsASObject=[];
    }

    for (var x=0 ; x<this.listOfContacts.length; x++){
      this.listOfContactsASObject[x] =JSON.parse(this.listOfContacts[x]);
    }
    console.log(this.listOfContacts[0]);
    sessionStorage.setItem("person", JSON.stringify(this.listOfContactsASObject));
    return csvArr;
   }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }
  fileReset() {
    this.csvReader.nativeElement.value = "";
  }

//<< Error Message if password feld empty
  passFormControl = new FormControl('', [
    Validators.required,
  ]); //>>

  @ViewChild('myInput') myInput!: ElementRef;

  constructor(public mainmenuComponent: MainmenuComponent) { }

  ngOnInit(): void {}

  test(){

    //Error if you didn't upload any file
    if (this.csvReader.nativeElement.value == ""){
    this.messageIfNoFile="Bitte eine CSV Datei Auswählen";
    this.messageIfWrongPass=""

    }
    else {
      this.messageIfNoFile="";
    }
    //Error if you enter wrong password or wrong csv file
    if (this.listOfContacts.length == 0 || this.listOfContacts==null || this.listOfContacts ==[] || this.listOfContacts==['']) {
      this.messageIfWrongPass = "Passwort ist falsch oder Falsche CSV Datei Ausgewählt";
      this.fileReset()
      console.log("bite richtige password eingeben")
    }
    else {
      sessionStorage.setItem("isDataConfirm", JSON.stringify(true));
      this.closeModal()
    }
    //Error if you didn't enter any password
    if(this.password =="" || this.password == null){
       this.myInput.nativeElement.focus();
      this.messageIfWrongPass=""

    }
  }

  closeModal() {
    this.fileReset()
    this.password=""
    this.messageIfNoFile=""
    this.messageIfWrongPass=""
    this.mainmenuComponent.closeModal()
  }


}
