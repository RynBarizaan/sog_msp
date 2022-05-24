import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MainmenuComponent} from "../mainmenu/mainmenu.component";
import {FormControl, Validators} from "@angular/forms";
import * as CryptoJS from 'crypto-js'
import {csvRecord} from "../model/csv-record";
import {Person} from "../model/person";
import {PersonDataService} from "../person-data.service";

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
        console.log("is works 1")

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
    let row:any;
    let listOfNeighborsBol:any;
    let listOfNeighborsStr=[];

    for (let i = 1; i < csvRecordsArray.length-1; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(/\r\n|\n/);
      let encrypt: csvRecord = new csvRecord();
      csvArr.push(encrypt);
      this.listOfContacts.push((CryptoJS.AES.decrypt(curruntRecord.toString(), this.password.trim()).toString(CryptoJS.enc.Utf8)));
      this.listOfContactsASObject=[];
    }

    for (var x=0; x<this.listOfContacts.length; x++){
      listOfNeighborsStr=[];
      row = (<string>this.listOfContacts[x]).split(",");
      listOfNeighborsStr = (<string>this.listOfContacts[x]).split("/");
   for (var y=1; y<listOfNeighborsStr.length-1; y++){
     listOfNeighborsStr.push(listOfNeighborsStr[y]);
    }

      this.listOfContactsASObject.push(new Person(row[0],row[1],JSON.parse(row[2]),JSON.parse(row[3]),JSON.parse(row[4]),JSON.parse(row[5]),JSON.parse(row[6]),JSON.parse(row[7]),listOfNeighborsStr,[]));
    }
    sessionStorage.removeItem("person");
    sessionStorage.setItem("person", JSON.stringify(this.listOfContactsASObject));
    // @ts-ignore
     return csvArr;
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }
  fileReset() {
    this.csvReader.nativeElement.value = "";
    this.messageIfNoFile =""
  }

//Error Message if password feld empty
  passFormControl = new FormControl('', [
    Validators.required,
  ]);
  @ViewChild('myInput') myInput!: ElementRef;

  constructor(public mainmenuComponent: MainmenuComponent) { }

  ngOnInit(): void {

  }
  test(){
    //Error if you didn't upload any file
    if (this.csvReader.nativeElement.value == ""){
    this.messageIfNoFile="Bitte eine CSV Datei Auswählen"
    this.myInput.nativeElement.focus();
  }
    else if (this.listOfContactsASObject.length == 0 && this.listOfContacts.length == 0){
      console.log("bite richtige password eingeben")
    }
    else if (this.password !="" && this.password != null){
      //
      sessionStorage.setItem("isDataConfirm", JSON.stringify(true));
      this.closeModal()
      console.log(this.listOfContacts)
    }


    else{
      this.myInput.nativeElement.focus();
      console.log("Bitte Passwort eingeben")
    }
  }

  closeModal() {
    this.fileReset()
    this.mainmenuComponent.closeModal()
  }


}
